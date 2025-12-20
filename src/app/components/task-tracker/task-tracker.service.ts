import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskTrackerService {

  tasks = [
    { id: 1, name: 'Gym', weeklyTarget: 5, enabled: true },
    { id: 2, name: 'Coding', weeklyTarget: 2, enabled: true },
    { id: 3, name: 'Reading', weeklyTarget: 3, enabled: true }
  ];

  // key = taskId_date
  private store = new Map<string, boolean>();

  today() {
    return new Date();
  }

  isLocked(date: Date) {
    const diff = (this.today().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 2;
  }

  key(taskId: number, date: string) {
    return `${taskId}_${date}`;
  }

  isCompleted(taskId: number, date: string) {
    return this.store.get(this.key(taskId, date)) ?? false;
  }

  toggle(taskId: number, date: string) {
    const k = this.key(taskId, date);
    this.store.set(k, !this.store.get(k));
  }
}
