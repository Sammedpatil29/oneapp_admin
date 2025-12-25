
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskTrackerService } from './task-tracker.service';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { TrackLoginComponent } from "../track-login/track-login.component";
import { Router } from '@angular/router';
import { LoaderComponent } from "../loader/loader.component";
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-task-tracker',
  imports: [FormsModule, CommonModule, TrackLoginComponent, LoaderComponent],
  templateUrl: './task-tracker.component.html',
  styleUrl: './task-tracker.component.css'
})
export class TaskTrackerComponent implements OnInit {
@ViewChild('exportArea', { static: false }) exportArea!: ElementRef;
  fromDate = '';
  toDate = '';
  dates: string[] = [];
  showAddTask = false;
  isLoggedIn:boolean = false;
  isDataUpdating:boolean = false;
  isLoading:boolean = true;
  userName = '';
  year = new Date().getFullYear()
userEmoji = '🙂';
newTaskName = '';
newTaskTarget = 3;
todayStr = this.format(new Date());
viewMode: 'day' | 'week' | 'month' = 'week';
selectedDate = this.todayStr;
showWaterReminder = false;
waterInterval: any;
waterAudio = new Audio('assets/ElevenLabs_2025-12-22T13_17_34_Rachel_pre_sp100_s50_sb75_se0_b_m2.mp3');

heatmapDays: any[] = [];

mockApiResponse:any;


  constructor(public tracker: TaskTrackerService, private router: Router) {}

  ngOnInit() {
    let token = sessionStorage.getItem('trackJwt')
    this.waterReminder()
  if(token){
    this.isLoggedIn = true
    this.getDashboard()
  }
  this.isLoading = false
  this.initDates();
}

// @HostListener('window:focus', ['$event'])
//   onWindowFocus(event: any) {
//     this.getDashboard();  
//   }

  initDates() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);

    this.fromDate = this.format(start);
    this.toDate = this.format(today);
    this.generateDates();
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

  // 1️⃣ determine next state
  const currentlyCompleted = this.tracker.isCompleted(task.id, date);
  const completed = !currentlyCompleted;

  const data = {
    taskId: task.id,
    date: date,
    completed: completed
  };

  // 2️⃣ call API first
  this.isDataUpdating = true
  this.tracker.completions(data).subscribe({
    next: (res: any) => {

      // 3️⃣ update UI only after success
      this.tracker.toggle(task.id, date);

      // 4️⃣ refresh heatmap
      this.setViewMode(this.viewMode);
      this.isDataUpdating = false
      console.log('Completion updated', res);
    },
    error: (err) => {
      console.error(err);
      this.isDataUpdating = false
      alert('Failed to update completion');
    }
  });
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

  const freqInput = prompt('Weekly frequency (1–7)', '3');
  const weeklyTarget = Math.min(7, Math.max(1, Number(freqInput || 3)));

  const data = {
    name: name.trim(),
    weeklyTarget
  };

  this.isLoading = true;

  this.tracker.addTask(data).subscribe({
    next: (res: any) => {
      this.isLoading = false;

      // ✅ push only after API success
      this.tracker.tasks.push(res);

      alert('Task added successfully');
    },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      alert('Failed to add task');
    }
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

exportAsImage() {
  const element = this.exportArea.nativeElement;

  html2canvas(element, {
    scale: 2,            // better quality
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then((canvas:any) => {
    
    const imageData = canvas.toDataURL('image/jpeg', 0.95);

    const link = document.createElement('a');
    link.href = imageData;
    link.download = `discipline-tracker-${this.todayStr}.jpg`;
    link.click();
  });
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

logout(){
  sessionStorage.removeItem('trackJwt')
  this.isLoggedIn = false;
}

logIn(event:any){
  this.isLoggedIn = event;
  this.getDashboard()
  console.log("Logged In:", this.isLoggedIn);
}

waterReminder(){
  setInterval(()=>{
    this.showWaterReminder = true
    this.waterAudio.currentTime = 0;
  this.waterAudio.play();
  setTimeout(()=>{
    this.showWaterReminder = false
  }, 5000)
  }, 15 * 60 * 1000)
}

getDashboard(){
  this.isLoading = true
  this.tracker.getDashboard().subscribe((res:any)=>{
    this.mockApiResponse = res
    this.tracker.tasks = this.mockApiResponse.tasks;

  // 2️⃣ Load completion data into service map
  this.mockApiResponse.completions.forEach((c:any) => {
    const key = `${c.taskId}_${c.date}`;
    this.tracker['store']?.set?.(key, c.completed);
  });

  // 3️⃣ (Optional) User info
  this.userName = this.mockApiResponse.user.name;
  this.userEmoji = this.mockApiResponse.user.emoji;
  this.buildHeatmap();
    this.isLoading  = false
  }, error => {
    this.isLoading  = false
  })
}



}
