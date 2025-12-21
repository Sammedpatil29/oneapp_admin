
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskTrackerService } from '../task-tracker/task-tracker.service';

@Component({
  selector: 'app-track-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './track-login.component.html',
  styleUrl: './track-login.component.css'
})
export class TrackLoginComponent implements OnInit {
@Output() isLoggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();
  mode: 'login' | 'signup' = 'login';

  // login
  loginEmail = '';
  loginPassword = '';

  // signup
  name = '';
  email = '';
  password = '';

  showPassword = false;
  loading = false;

  emoji = '✨';
  userEmoji = '🌱';

  private emojis = ['🔥','🚀','😎','💪','✨','🧠','🎯','⚡','👑','🌱','🏆'];
  private emojisSignup = [
  '😀','😃','😄','😁','😊','🙂','😉','😌','😍','😘',
  '😎','🤓','😇','🤗','😏','😋','🤩','🥳','😺',
  '😴','🤤','😛','😜','🤪','😝',
  '😐','😑','😶','🙄','😬','🤐',
  '😕','😟','🙁','☹️','😮','😯',
  '😲','😳','🥺','😢','😭',
  '😤','😠','😡','🤬',
  '🤯','😱','😨','😰','😥',
  '🤔','🫡','🤨'
];

constructor(private router: Router, private taskTrackerService: TaskTrackerService) { }

  ngOnInit() {
    this.emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    this.userEmoji = this.emojisSignup[Math.floor(Math.random() * this.emojisSignup.length)];
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
     this.emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
  }

  changeEmoji() {
    this.userEmoji = this.emojisSignup[Math.floor(Math.random() * this.emojisSignup.length)];
  }

  submit() {
    this.loading = true;
    if (this.mode === 'login') {
      // Perform login
      const loginData = { email: this.loginEmail, password: this.loginPassword };
      this.taskTrackerService.loginUser(loginData).subscribe(
        (response:any) => {
          console.log('Login successful:', response);
          sessionStorage.setItem('trackJwt', response['token']);
          this.isLoggedIn.emit(true);
          this.loading = false;
        })
  } else {
      // Perform signup
      const signupData = { name: this.name, email: this.email, password: this.password, emoji: this.userEmoji };
      this.taskTrackerService.registerUser(signupData).subscribe(
        (response:any) => {
          console.log('Signup successful:', response);
          sessionStorage.setItem('trackJwt', response['token']);
          this.isLoggedIn.emit(true);
          this.loading = false;
        })
  }
}
}
