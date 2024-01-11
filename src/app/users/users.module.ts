import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersService } from './service/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { DxToastModule } from 'devextreme-angular';

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    DxToastModule,
  ],
  providers: [UsersService],
})
export class UsersModule {}
