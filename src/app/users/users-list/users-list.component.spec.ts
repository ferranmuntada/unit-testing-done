import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { User } from '../interfaces/user.interface';
import { Observable, of, throwError } from 'rxjs';
import { UsersService } from '../service/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from 'src/app/shared/service/toast.service';

// Clase stub para simular UsersService
class UsersServiceStub {
  // Método stub para simular getUsers()
  public getUsers(): Observable<User[]> {
    return of([
      // Datos de prueba
      {
        id: 1,
        name: 'John',
        email: 'email@jhon.com',
      },
      {
        id: 2,
        name: 'Mark',
        email: 'email@Mark.com',
      },
    ]);
  }

  // Método stub para simular createUser()
  public createUser(user: User): Observable<User> {
    return of({
      // Usuario devuelto por el servicio simulado
      id: 1,
      name: 'John',
      email: 'email@jhon.com',
    });
  }
}

// Clase stub para simular ToastService
class ToastServiceStub {
  showSuccess(message: string) {} // Simulación vacía para showSuccess()
  showError(message: string) {} // Simulación vacía para showError()
}

// Descripción del grupo de pruebas para UsersListComponent
describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let usersService: UsersService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: UsersService, useClass: UsersServiceStub },
        { provide: ToastService, useClass: ToastServiceStub },
      ],
    });
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  // Test para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Grupo de pruebas para la función onSubmit
  describe('>> OnSubmit', () => {
    // Test para verificar que se cargan los usuarios al iniciar
    it('should load users on initialization', () => {
      spyOn(usersService, 'getUsers').and.callThrough();
      component.ngOnInit();
      expect(usersService.getUsers).toHaveBeenCalled();
    });

    // Test para verificar que se llama a addUser cuando el formulario es válido y no hay usuario seleccionado
    it('should call addUser when form is valid and no user is selected', () => {
      const user = {
        name: 'New User',
        email: 'new@exammple.com',
      };
      const spy = spyOn(usersService, 'createUser').and.returnValue(of([]));
      component.userForm.setValue(user);
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(user);
    });

    // Test para verificar que se maneja correctamente un error al cargar usuarios después de agregar uno
    it('should call addUser when form is valid and no user is selected and loadUsers should throw error', () => {
      const user = {
        name: 'New User',
        email: 'new@exammple.com',
      };
      const errorMessage = 'Error al crear el usuario';
      spyOn(toastService, 'showError').and.callThrough();
      const spy = spyOn(usersService, 'createUser').and.returnValue(of([]));
      spyOn(usersService, 'getUsers').and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      component.userForm.setValue(user);
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(user);
      expect(toastService.showError).toHaveBeenCalledWith(errorMessage);
    });

    // Test para verificar que se actualiza un usuario cuando el formulario es válido y hay un usuario seleccionado
    it('should call updateUser when form is valid and a user is selected', () => {
      const toastSpy = spyOn(toastService, 'showSuccess');
      component.selectedUser = {
        id: 1,
        name: 'Existing User',
        email: 'existing@example.com',
      };
      component.userForm.setValue({
        name: 'Updated User',
        email: 'updated@example.com',
      });
      component.onSubmit();
      expect(toastSpy).toHaveBeenCalledWith('User updated successfully');
    });

    // Test para manejar un error al agregar un usuario
    it('should handle error when adding a user fails', () => {
      const errorMessage = 'Error al crear el usuario';

      spyOn(usersService, 'createUser').and.returnValue(
        throwError(() => new Error(errorMessage))
      );
      spyOn(toastService, 'showError').and.callThrough();

      component.onSubmit();

      expect(usersService.createUser).toHaveBeenCalledWith({
        name: '',
        email: '',
      });
      expect(toastService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Grupo de pruebas para la función editUser
  describe('>> EditUser', () => {
    // Test para verificar que se establece el usuario seleccionado y se actualizan los valores del formulario
    it('should set selectedUser and patch form values for edit', () => {
      const testUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      component.editUser(testUser);
      expect(component.selectedUser).toEqual(testUser);
      expect(component.userForm.value).toEqual({
        name: testUser.name,
        email: testUser.email,
      });
    });
  });

  // Grupo de pruebas para la función deleteUser
  describe('>> DeleteUser', () => {
    // Test para verificar que se elimina un usuario
    it('should delete a user', () => {
      spyOn(toastService, 'showSuccess');
      const initialLength = component.users.length;
      component.deleteUser(1);
      expect(component.users.length).toBeLessThan(initialLength);
      expect(toastService.showSuccess).toHaveBeenCalledWith(
        'Users removed successfully'
      );
    });

    // Test para manejar un error durante la eliminación de un usuario
    it('should handle error during user deletion', () => {
      spyOn(toastService, 'showError');
      component.deleteUser(undefined);
      expect(toastService.showError).toHaveBeenCalledWith(
        'We could not remove the user'
      );
    });
  });
});
