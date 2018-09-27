import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimeService } from '../../../services/time.service';
import { OrderService } from '../../../services/order.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Order } from '../../../models/order.model';
import { Time } from '../../../models/time.model';

//import { MomentModule } from 'ngx-moment';

@Component({
  selector: 'app-create',
  templateUrl: './time-create.component.html',
  styleUrls: ['./time-create.component.css']
})
export class TimeCreateComponent implements OnInit {
  //myControl = new FormControl();
 // clients: string[]=[];// = this.fetchProjects();//['One', 'Two', 'Three'];
  //orderNumber: string[]=[];
 // filteredClients: Observable<string[]>;
 time: Time = new Time();

  createForm: FormGroup;
  orders: Order[] = null;
  user_id;


  constructor(private orderService: OrderService, private userService: UserService,
              private timeService: TimeService, private fb: FormBuilder, private router: Router) {
   /*
    this.createForm = this.fb.group({
      dateOfWork: [new Date, Validators.required],
      orderNumber: ['', Validators.required],
      description: ['', Validators.required],
      time: [0, Validators.required],
    });
*/
    }
    //Gets the order _i by passing an orderNumber; then,
    //Adds new time to the time collection passing the order _id, and user _id; then,
    //Adds new time _id to the current user's document; then,
    //Adds new time _id to the selected order.
    addTime() {
      this.orderService.getOrderIdByOrderNumber(this.createForm.value.orderNumber).subscribe((order_id: any) => {
        //console.log('This is the order _id ' + order);
            this.timeService.addTime(this.createForm.value.date.toDateString(), order_id,
                                     this.createForm.value.description, this.createForm.value.time,
                                     localStorage.getItem('user_id')).subscribe((time_id: any) => {
                                          console.log('this is the time _id' + time_id);
                                          this.userService.addTimeToUser(localStorage.getItem('user_id'), time_id._id)
                                               .subscribe((user:any)=>{
                                            console.log('This is the user _id ' + user);
                                          });

                });
                this.router.navigate(['/times']);
      });


    }

   /*
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
      return this.clients.filter(client => client.toLowerCase().includes(filterValue));
    }

     async fetchProjects(){
      this.orderService.getOrders().subscribe(
        (data: Order[])=>{
         for(let i = 0; i < data.length; i++){
            this.clients.push(Object.values(data[i])[3]);
           console.log(this.clients);
          // console.log(data);
         }},
        err => {
          if(err instanceof HttpErrorResponse){
              if(err.status === 401){
                this.router.navigate(['/auth']);
              }
          }
        }
      );
    }
    */




  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');

    this.createForm = this.fb.group({
      'date': [this.time.date, Validators.required],
      'orderNumber': [this.time.orderNumber, Validators.required],
      'description': [this.time.description, Validators.required],
      'time': [this.time.time, Validators.required],
    });

    /*
    this.fetchProjects().then(()=>{
      this.filteredClients = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
    */
  }
}
