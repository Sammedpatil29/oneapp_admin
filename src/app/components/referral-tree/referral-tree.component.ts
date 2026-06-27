import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ReferralNode {
  id: number;
  name: string;
  email: string;
  phone: string;
  referrals?: ReferralNode[];
  referralCount: number;
}

@Component({
  selector: 'app-referral-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './referral-tree.component.html',
  styleUrl: './referral-tree.component.css'
})
export class ReferralTreeComponent implements OnInit {
  allUsers = new Map<number, ReferralNode>();
  currentUser: ReferralNode | null = null;
  breadcrumb: ReferralNode[] = [];
  childUsers: ReferralNode[] = [];
  searchQuery: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.loadInitialUser();
  }

  loadInitialUser(): void {
    // In a real app, you'd fetch the initial user by ID from `this.data.item.id`
    // The data is now structured as a single nested JSON object.
    const rootUser: ReferralNode = {
      id: 1,
      name: 'Super Admin',
      email: 'superadmin@oneapp.com',
      phone: '9876543210',
      referralCount: 2,
      referrals: [
        {
          id: 2,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1112223333',
          referralCount: 1,
          referrals: [
            {
              id: 4,
              name: 'Alice',
              email: 'alice@example.com',
              phone: '4445556666',
              referralCount: 0,
              referrals: [],
            },
          ],
        },
        {
          id: 3,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '7778889999',
          referralCount: 0,
          referrals: [],
        },
        {
          id: 2,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1112223333',
          referralCount: 1,
          referrals: [
            {
              id: 4,
              name: 'Alice',
              email: 'alice@example.com',
              phone: '4445556666',
              referralCount: 0,
              referrals: [],
            },
          ],
        },
        {
          id: 3,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '7778889999',
          referralCount: 0,
          referrals: [],
        },
      ],
    };
    this.populateUserMap(rootUser);
    this.navigateToUser(rootUser);
  }

  navigateToUser(user: ReferralNode): void {
    // Here you would fetch user's referrals by ID if they aren't loaded
    this.currentUser = user;
    this.childUsers = user.referrals || [];
    this.breadcrumb.push(user);
  }

  navigateToBreadcrumb(user: ReferralNode, index: number): void {
    this.currentUser = user;
    this.childUsers = user.referrals || [];
    this.breadcrumb = this.breadcrumb.slice(0, index + 1);
  }

  private populateUserMap(user: ReferralNode): void {
    this.allUsers.set(user.id, user);
    if (user.referrals && user.referrals.length > 0) {
      for (const child of user.referrals) {
        this.populateUserMap(child);
      }
    }
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement search logic here later
    // This would typically clear the breadcrumb and show search results.
  }

}
