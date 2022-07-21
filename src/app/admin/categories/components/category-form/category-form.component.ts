import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CategoriesService } from '../../../../core/services/categories.service';
import { MyValidators } from '../../../../utils/validators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  categoryId: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private router: Router,
    private storage: AngularFireStorage,
    private route: ActivatedRoute
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.categoryId = params.id;
      if (this.categoryId) {
        this.getCategory();
      }
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.minLength(4)],
        [MyValidators.validateCategory(this.categoriesService)],
      ],
      image: ['', Validators.required],
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get imageField() {
    return this.form.get('image');
  }

  save() {
    if (this.form.valid) {
      if (this.categoryId) {
        this.updateCategory()
      } else {
        this.createCategory();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createCategory() {
    const data = this.form.value;
    this.categoriesService.createCategory(data).subscribe((res) => {
      this.router.navigate(['./admin/categories']);
    });
  }
  private updateCategory() {
    const data = this.form.value;
    this.categoriesService
      .updateCategory(this.categoryId, data)
      .subscribe((res) => {
        this.router.navigate(['./admin/categories']);
      });
  }

  private getCategory() {
    this.categoriesService.getCategory(this.categoryId).subscribe((res) => {
      this.form.patchValue(res);
    });
  }

  uploadFile(event) {
    const image = event.target.files[0];
    const name = new Date().toString();
    const ref = this.storage.ref(name);
    const task = this.storage.upload(name, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          const urlImage$ = ref.getDownloadURL();
          urlImage$.subscribe((url) => {
            console.log(url);
            this.imageField.setValue(url);
          });
        })
      )
      .subscribe();
  }
}
