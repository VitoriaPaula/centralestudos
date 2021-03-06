import { Courses } from './courses.model';
import { CourserService } from './courses.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  breakpoint: number;
  cursos: Courses[] = [];
  private cursosSubscription: Subscription;
  public estaCarregando = false;
  apareceMsg = false;
  totalDeClientes: number = 0;
  totalDeClientesPorPagina: number = 2;
  opcoesTotalDeClientesPorPagina = [2, 5, 10];
  paginaAtual: number = 1; //definir

  constructor(public courseService: CourserService) { }

  ngOnInit(): void {

    this.breakpoint = (window.innerWidth <= 1200) ? 1 : 3;

    this.estaCarregando = true;
    this.courseService.getCourses();
    this.cursosSubscription = this.courseService
    .getListaDeCursosAtualizadaObservable()
    .subscribe((dados) => {
      this.cursos = dados.courses;
      console.log(this.cursos)
      this.estaCarregando = false;
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1200) ? 1 : 3;

  }

  ngOnDestroy(): void {
    this.cursosSubscription.unsubscribe();
  }

  onPaginaAlterada(dadosPagina: PageEvent) {
    //console.log (dadosPagina);
    this.paginaAtual = dadosPagina.pageIndex + 1; //no paginator a contagem começa de 0
    this.totalDeClientesPorPagina = dadosPagina.pageSize;
    this.courseService.getCourses();

  }

  ngCursosFiltrados(linguagem: string, categoria: string, site: string): void {
    this.estaCarregando = true;
    this.apareceMsg = false
    console.log("Chegou no Componente Cursos")
    this.courseService.getCursosFiltrados(linguagem, categoria, site);
    this.cursosSubscription = this.courseService
    .getListaDeCursosAtualizadaObservable()
    .subscribe((dados) => {
      this.cursos = dados.courses;
      console.log(this.cursos)
      this.estaCarregando = false;
      if (this.cursos.length <= 0){
        this.apareceMsg = true;
      }
      else {
        this.apareceMsg = false
      }
    });
    
  }

}
