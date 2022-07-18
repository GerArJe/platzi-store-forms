import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { Category } from '../../../../core/models/category.model';
import { CategoriesService } from '../../../../core/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit  {
  dataSource: MatTableDataSource<Category>;
  displayedColumns: string[] = ['_id', 'created_at', 'image', 'name', 'type'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private categoriesService: CategoriesService) {}

  ngAfterViewInit(): void {
    this.getAllCategories();
  }

  ngOnInit(): void {
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
