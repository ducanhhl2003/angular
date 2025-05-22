import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-useradmin',
  templateUrl: './useradmin.component.html',
  styleUrls: ['./useradmin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class UserAdminComponent implements OnInit {
  users: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers(this.currentPage, 10).subscribe({
      next: (response) => {
        console.log('Dữ liệu người dùng:', response);
        this.users = response?.data?.listResult || []; // Lấy danh sách người dùng
        this.totalPages = response?.data?.totalPage || 1;
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
      }
    });
  }

  changePage(newPage: number) {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.fetchUsers();
    }
  }
}

