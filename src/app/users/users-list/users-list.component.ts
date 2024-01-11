import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from '../service/users.service';
import { User } from '../interfaces/user.interface';
import { ToastService } from 'src/app/shared/service/toast.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {
  @ViewChild('appDeveXtrem') divdevextrem: any;

  users: User[] = [];
  userForm!: FormGroup;
  selectedUser!: User | null;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {
    this.userForm = this.formBuilder.group({
      name: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public onSubmit(): void {
    console.log('this.userform.valid', this.userForm.valid);
    if (this.userForm.valid) {
      console.log('entra');
      if (this.selectedUser) {
        const updatedUser = { ...this.selectedUser, ...this.userForm.value };
        this.updateUser(updatedUser);
        this.selectedUser = null;
        this.userForm.reset();
      } else {
        this.addUser(this.userForm.value);
      }
    }
  }

  public editUser(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
    });
  }

  public deleteUser(id: number | undefined): void {
    if (id !== undefined) {
      this.users = this.users.filter((user) => user.id !== id);
      this.toastService.showSuccess('Users removed successfully');
    } else {
      this.toastService.showError('We could not remove the user');
    }
  }

  private addUser(user: User): void {
    this.usersService.createUser(user).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.showError(err.message);
      },
    });
  }

  private loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.toastService.showSuccess('Users loaded successfully');
      },
      error: (err) => {
        this.toastService.showError(err.message);
      },
    });
  }

  private updateUser(updatedUser: User): void {
    const index = this.users.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
    this.toastService.showSuccess('User updated successfully');
  }
}
