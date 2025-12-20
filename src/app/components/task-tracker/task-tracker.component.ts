
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskTrackerService } from './task-tracker.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-task-tracker',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-tracker.component.html',
  styleUrl: './task-tracker.component.css'
})
export class TaskTrackerComponent implements OnInit {

  fromDate = '';
  toDate = '';
  dates: string[] = [];
  showAddTask = false;
  userName = '';
userEmoji = '🙂';
newTaskName = '';
newTaskTarget = 3;
todayStr = this.format(new Date());
viewMode: 'day' | 'week' | 'month' = 'week';
selectedDate = this.todayStr;

heatmapDays: any[] = [];

mockApiResponse = {
  user: {
    id: 101,
    name: 'Sammed',
    emoji: '😎'
  },

  tasks: [
    {
      id: 1,
      name: 'Gym',
      weeklyTarget: 5,
      enabled: true
    },
    {
      id: 2,
      name: 'Coding',
      weeklyTarget: 2,
      enabled: true
    },
    {
      id: 3,
      name: 'Reading',
      weeklyTarget: 3,
      enabled: false
    }
  ],

  completions: [
    { taskId: 1, date: '2025-09-18', completed: true },
    { taskId: 1, date: '2025-09-19', completed: true },
    { taskId: 2, date: '2025-09-19', completed: true },
    { taskId: 3, date: '2025-09-20', completed: false }
  ]
};


  constructor(public tracker: TaskTrackerService) {}

  ngOnInit() {
  this.initDates();
  this.loadFromApi(); // 👈 simulate API
  this.buildHeatmap();
}

  initDates() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);

    this.fromDate = this.format(start);
    this.toDate = this.format(today);
    this.generateDates();
  }

  loadFromApi() {
  // 1️⃣ Set tasks
  this.tracker.tasks = this.mockApiResponse.tasks;

  // 2️⃣ Load completion data into service map
  this.mockApiResponse.completions.forEach(c => {
    const key = `${c.taskId}_${c.date}`;
    this.tracker['store']?.set?.(key, c.completed);
  });

  // 3️⃣ (Optional) User info
  this.userName = this.mockApiResponse.user.name;
  this.userEmoji = this.mockApiResponse.user.emoji;
}


  generateDates() {
    this.dates = [];
    let d = new Date(this.fromDate);
    const end = new Date(this.toDate);

    while (d <= end) {
      this.dates.push(this.format(d));
      d.setDate(d.getDate() + 1);
    }
  }

  format(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  toggle(task: any, date: string) {
    this.tracker.toggle(task.id, date);
    this.setViewMode(this.viewMode); // refresh heatmap
  }

//   toggle(task: any, date: string) {
//   this.tracker.toggle(task.id, date);

//   // later API
//   // POST /completion
// }

  todayPercentage() {
    const today = this.format(new Date());
    const enabled = this.tracker.tasks.filter(t => t.enabled);

    let done = 0;
    enabled.forEach(t => {
      if (this.tracker.isCompleted(t.id, today)) done++;
    });

    return enabled.length ? Math.round((done / enabled.length) * 100) : 0;
  }

  rangePercentage() {
    let done = 0, total = 0;

    this.tracker.tasks.forEach(task => {
      if (!task.enabled) return;

      this.dates.forEach(d => {
        if (!this.tracker.isLocked(new Date(d))) {
          total++;
          if (this.tracker.isCompleted(task.id, d)) done++;
        }
      });
    });

    return total ? Math.round((done / total) * 100) : 0;
  }

  weeklyPercentage() {
  return this.calculateForLastDays(7);
}

monthlyPercentage() {
  return this.calculateForLastDays(30);
}

calculateForLastDays(days: number) {
  const today = new Date();
  let done = 0, total = 0;

  this.tracker.tasks.forEach(task => {
    if (!task.enabled) return;

    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      if (this.tracker.isLocked(d)) continue;

      total++;
      if (this.tracker.isCompleted(task.id, this.format(d))) done++;
    }
  });

  return total ? Math.round((done / total) * 100) : 0;
}

disciplineScore() {
  // Weighted: Today 40%, Weekly 40%, Monthly 20%
  return Math.round(
    this.todayPercentage() * 0.4 +
    this.weeklyPercentage() * 0.4 +
    this.monthlyPercentage() * 0.2
  );
}

strongestTask() {
  return this.taskConsistency(true);
}

weakestTask() {
  return this.taskConsistency(false);
}

taskConsistency(best: boolean) {
  let result = null;
  let score = best ? -1 : 101;

  this.tracker.tasks.forEach(task => {
    if (!task.enabled) return;

    let done = 0, total = 0;

    this.dates.forEach(d => {
      if (this.tracker.isLocked(new Date(d))) return;
      total++;
      if (this.tracker.isCompleted(task.id, d)) done++;
    });

    if (!total) return;

    const pct = Math.round((done / total) * 100);

    if ((best && pct > score) || (!best && pct < score)) {
      score = pct;
      result = task.name;
    }
  });

  return result;
}

currentStreak() {
  let streak = 0;
  const today = new Date();

  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    if (this.tracker.isLocked(d)) break;

    const completedAll = this.tracker.tasks
      .filter(t => t.enabled)
      .every(t => this.tracker.isCompleted(t.id, this.format(d)));

    if (completedAll) streak++;
    else break;
  }

  return streak;
}

openAddTask() {
  this.showAddTask = true;
}

closeAddTask() {
  this.showAddTask = false;
  this.newTaskName = '';
}

addTask() {
  if (!this.newTaskName.trim()) return;

  this.tracker.tasks.push({
    id: Date.now(),
    name: this.newTaskName.trim(),
    weeklyTarget: this.newTaskTarget,
    enabled: true
  });

  this.closeAddTask();
}

/* Date logic */
onDateChange() {
  const from = new Date(this.fromDate);
  const to = new Date(this.toDate);

  const diff =
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 0 || diff > 14) {
    alert('Please select a range of max 15 days');
    return;
  }

  this.generateDates();
}

addTaskPrompt() {
  const name = prompt('Enter task name');
  if (!name || !name.trim()) return;

  const freq = prompt('Weekly frequency (1–7)', '3');
  const weeklyTarget = Math.min(7, Math.max(1, Number(freq || 3)));

  this.tracker.tasks.push({
    id: Date.now(),
    name: name.trim(),
    weeklyTarget,
    enabled: true
  });
}

exportCSV() {
  const rows: string[] = [];

  // Header
  const header = ['Task', ...this.dates];
  rows.push(header.join(','));

  // Data rows
  this.tracker.tasks.forEach(task => {
    const row = [task.name];

    this.dates.forEach(d => {
      const val = this.tracker.isCompleted(task.id, d) ? '1' : '0';
      row.push(val);
    });

    rows.push(row.join(','));
  });

  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'discipline_tracker.csv';
  a.click();

  window.URL.revokeObjectURL(url);
}

editTask(task: any) {
  const name = prompt('Edit task name', task.name);
  if (!name) return;

  const freq = prompt('Weekly frequency (1–7)', task.weeklyTarget);
  task.name = name.trim();
  task.weeklyTarget = Math.min(7, Math.max(1, Number(freq)));
}

setViewMode(mode: 'day' | 'week' | 'month') {
  this.viewMode = mode;
  this.buildHeatmap();
}

onViewDateChange() {
  this.buildHeatmap();
}

buildHeatmap() {
  this.heatmapDays = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  const base = new Date(this.selectedDate);
  base.setHours(0, 0, 0, 0);

  const days =
    this.viewMode === 'day' ? 1 :
    this.viewMode === 'week' ? 7 : 30;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    d.setHours(0, 0, 0, 0);

    // ❌ skip only future dates
    if (d.getTime() > today.getTime()) continue;

    const percent = this.dayCompletionPercent(d);

    this.heatmapDays.push({
      date: this.format(d),
      label:
        this.viewMode === 'day'
          ? 'Today'
          : this.viewMode === 'week'
            ? d.toLocaleDateString('en-US', { weekday: 'short' })
            : d.getDate().toString(),
      percent
    });
  }
}


dayCompletionPercent(date: Date) {
  let done = 0;
  let total = 0;

  this.tracker.tasks.forEach(task => {
    if (!task.enabled) return;

    total++;
    if (this.tracker.isCompleted(task.id, this.format(date))) {
      done++;
    }
  });

  return total ? Math.round((done / total) * 100) : 0;
}

getHeatClass(percent: number) {
  if (percent === 0) return 'hm-0';
  if (percent <= 25) return 'hm-1';
  if (percent <= 50) return 'hm-2';
  if (percent <= 75) return 'hm-3';
  return 'hm-4';
}



}
