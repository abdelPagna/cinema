import { Component, OnInit } from '@angular/core';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes:any;
  public cinemas:any;
  public currentVille:any;
  public currentCinemas:any;
  public salles:any;
  public currentProjection:any;
  public selectedTickets: any;

  constructor(public cinemaService:CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data=>{
        this.villes=data;
      },err=>{
        console.log(err);
      })
  }

  onGetCinemas(v:any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },err=>{
        console.log(err);
      })
  }

  onGetSalles(c:any) {
    this.currentCinemas=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles=data;

        // @ts-ignore
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections=data;
            },err=>{
              console.log(err);
            })
        })
      },err=>{
        console.log(err);
      })
  }


  onGetTicketsPlaces(p:any) {
    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[];
      },err=>{
        console.log(err);
      })
  }

  onSelectTicket(t:any) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    }
    else {
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
  }

  getTicketsClass(t:any) {
    let str="btn ticket ";
    if (t.reserve==true){
      str+="btn-danger";
    }
    else if (t.selected){
      str+="btn-warning";
    }
    else {
      str+="btn-success"
    }
    return str;
  }

  onPayTickets(dataForm:any) {
    let tickets:any=[];
    // @ts-ignore
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=>{
        alert("Tickets Réservés avec succès!!!!!!!");
        this.onGetTicketsPlaces(this.currentProjection);
      },err=>{
        console.log(err);
      })
  }
}
