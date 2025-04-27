import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-home',
  standalone: true,
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,  // Asegúrate de importar MatTableModule
    FormsModule,
    CommonModule,
  ]
})
export class ProductHomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  nameFilter: string = '';
  stateFilter: string = '';

  // Definir las columnas de la tabla
  displayedColumns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];

  isHandset$: Observable<boolean>;

  constructor(private productService: ProductService, private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(response => {
      this.products = response.data;
      this.filteredProducts = this.products;
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      const matchesState = this.stateFilter ? this.mapStateToText(product.state).toLowerCase() === this.stateFilter.toLowerCase() : true;
      return matchesName && matchesState;
    });
  }

  mapStateToText(state: number): string {
    return state === 1 ? 'Activo' : 'Inactivo';
  }

  openProductDlg(product?: Product): void {
    console.log('Open dialog for product:', product);
  }

  inactiveProduct(productId: number): void {
    console.log('Inactive product with ID:', productId);
  }
}
