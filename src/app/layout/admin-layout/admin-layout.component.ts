import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Importaciones de Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';  // Asegúrate de importar MatTableModule para la tabla
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // IMPORTANTE: Asegúrate de importar CommonModule
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,  // Agregar MatTableModule para la tabla
    RouterLink,
    RouterLinkActive,
    FormsModule
  ]
})
export class AdminLayoutComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);  // Inyección de servicio para detectar tamaño de pantalla

  // Observable que detecta si la pantalla es pequeña (móvil o tablet)
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Propiedades para los filtros
  nameFilter: string = '';
  stateFilter: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];

  // Definir las columnas de la tabla que se mostrarán
  displayedColumns: string[] = ['name', 'state'];
  dataSource = this.filteredProducts; // Asegúrate de que dataSource esté vinculado a filteredProducts

  // Método que se activa cuando el filtro cambia
  applyFilters(): void {
    // Filtra los productos según los valores de los filtros
    this.filteredProducts = this.products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const matchesState = this.stateFilter ? this.mapStateToText(product.state).toLowerCase() === this.stateFilter.toLowerCase() : true;
      return matchesName && matchesState;
    });
    console.log('Filters applied:', this.nameFilter, this.stateFilter);

    // Actualizar el dataSource después de aplicar los filtros
    this.dataSource = this.filteredProducts;
  }

  // Mapea el estado del producto a texto (activo o inactivo)
  mapStateToText(state: number): string {
    return state === 1 ? 'Activo' : 'Inactivo';
  }

  // Método de inicialización del componente
  ngOnInit(): void {
    // Carga los productos o datos que quieras mostrar
    this.loadProducts();
  }

  // Método para cargar productos (puedes hacer que esta lógica sea dinámica llamando a un servicio)
  loadProducts(): void {
    this.products = [
      { name: 'Producto 1', state: 1 },
      { name: 'Producto 2', state: 0 },
      { name: 'Producto 3', state: 1 }
    ];
    this.filteredProducts = this.products;  // Inicializa los productos filtrados
    this.dataSource = this.filteredProducts;  // Asigna los productos filtrados a dataSource
  }
}
