import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UsersService } from './users.service';
import { User } from '../interfaces/user.interface';

describe('UsersService', () => {
  let service: UsersService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', fakeAsync(() => {
    let users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Mark' },
    ];
    let response: User[] = [];

    // Llamada al servicio
    service.getUsers().subscribe((res) => {
      response = res;
    });

    // Simular la respuesta del servidor
    const req = http.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toEqual('GET');
    req.flush(users); // Aquí proporcionamos los datos de prueba como respuesta

    http.verify();
    tick(); // Simula el paso del tiempo para operaciones asíncronas

    // Verificar que la respuesta es igual a los datos de prueba
    console.log('response=>', response);
    expect(response).toEqual(users as User[]); // Update the expectation to include the type of the response
  }));

  it('should get user by Id', fakeAsync(() => {
    let user = { id: 1, name: 'John' };
    let response: any;

    // Llamada al servicio
    service.getUserById(1).subscribe((res) => {
      response = res;
    });

    // Simular la respuesta del servidor
    const req = http.expectOne('https://jsonplaceholder.typicode.com/users/1');
    expect(req.request.method).toEqual('GET');
    req.flush(user); // Aquí proporcionamos los datos de prueba como respuesta

    http.verify();
    tick(); // Simula el paso del tiempo para operaciones asíncronas

    // Verificar que la respuesta es igual a los datos de prueba
    console.log('response=>', response);
    expect(response).toEqual(user as User); // Update the expectation to include the type of the response
  }));
  it('should create user', fakeAsync(() => {
    let user = { id: 1, name: 'John', email: 'emial@jhon.com' };
    let response: any;

    // Llamada al servicio
    service.createUser(user).subscribe((res) => {
      response = res;
    });

    // Simular la respuesta del servidor
    const req = http.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toEqual('POST');
    req.flush(user); // Aquí proporcionamos los datos de prueba como respuesta

    http.verify();
    tick(); // Simula el paso del tiempo para operaciones asíncronas

    // Verificar que la respuesta es igual a los datos de prueba
    console.log('response=>', response);
    expect(response).toEqual(user as User); // Update the expectation to include the type of the response
  }));

  it('should update user', fakeAsync(() => {
    let user = { id: 1, name: 'John', email: 'emial@jhon.com' };
    let response: any;

    // Llamada al servicio
    service.updateUser(user).subscribe((res) => {
      response = res;
    });

    // Simular la respuesta del servidor
    const req = http.expectOne('https://jsonplaceholder.typicode.com/users/1');
    expect(req.request.method).toEqual('PUT');
    req.flush(user); // Aquí proporcionamos los datos de prueba como respuesta

    http.verify();
    tick(); // Simula el paso del tiempo para operaciones asíncronas

    // Verificar que la respuesta es igual a los datos de prueba
    console.log('response=>', response);
    expect(response).toEqual(user as User); // Update the expectation to include the type of the response
  }));

  it('should delete user', fakeAsync(() => {
    let response: any;

    // Llamada al servicio
    service.deleteUser(1).subscribe((res) => {
      response = res;
    });

    // Simular la respuesta del servidor
    const req = http.expectOne('https://jsonplaceholder.typicode.com/users/1');
    expect(req.request.method).toEqual('DELETE');
    req.flush({}); // Aquí proporcionamos los datos de prueba como respuesta

    http.verify();
    tick(); // Simula el paso del tiempo para operaciones asíncronas

    // Verificar que la respuesta es igual a los datos de prueba
    console.log('response=>', response);
    expect(response).toEqual({}); // Update the expectation to include the type of the response
  }));
});
