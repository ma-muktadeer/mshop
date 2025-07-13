import { NgClass } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { AlertService } from '../../../../ithouse/common/alert.service';
import { CommonService } from '../../../../ithouse/common/common.service';
import { FileService } from '../../../../ithouse/common/file.service';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { Service } from '../../../../ithouse/common/service';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';
import { SelectDropdownComponent } from "../../../../ithouse/shard-componenrts/select-dropdown/select-dropdown.component";
import { Category } from '../../../../objests/product-info/category';
import { Product } from '../../../../objests/product-info/product';
import { ProductSellBy } from '../../../../objests/product-info/product-sell-by';
import { SubCategory } from '../../../../objests/product-info/sub-category';

@Component({
  selector: 'ithouse-product',
  imports: [NgClass, FormsModule, SelectDropDownModule, SelectDropdownComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [NgbActiveModal]
})
export class ProductComponent extends Ithouse implements Service, OnInit {

  item = [
    { name: 'a' },
    { name: 'a' },
    { name: 'a' },
    { name: 'a' },
  ]

  description: string = 'We\'ve partnered with Coastal Green Wellness based out of Myrtle Beach South Carolina...';
  accept: string[];
  uploadFor: string;
  productImage: WritableSignal<string[]> = signal<string[]>([], { equal: _.isEqual });
  index: number = 0;
  isUpdate: boolean = false;
  isHovering: boolean = false;
  userProductInfo: WritableSignal<Product[]> = signal([{
    productId: null,
    isActive: 1,
    productName: '',
    productDescription: '',
    createDate: new Date(),
    productSellBy: ProductSellBy.IN_STORE,
    productCategories: new Array(new Category())
  }]);
  productInfo: Product = {
    productId: null,
    isActive: 1,
    productName: '',
    productDescription: '',
    createDate: new Date(),
    productSellBy: ProductSellBy.IN_STORE,
    productCategories: new Array(new Category()),
  };
  productSubCategories: SubCategory[] = [];
  // selectedValue: any;
  constructor(private alert: AlertService,
    private fileService: FileService,
    private cs: CommonService,
    public md: NgbActiveModal
  ) {
    super();

  }

  ngOnInit(): void {
    this.loadProductInfo();
  }

  uploadFile(input: HTMLInputElement, accept: string, uploadFor: 'text' | 'image') {
    this.accept = accept.split(',').map(m => m.trim().toLowerCase());
    this.uploadFor = uploadFor;
    input.setAttribute('accept', accept)
    input.click();
  }
  onProfileImageChange(event: any, fileInput: HTMLInputElement) {

    debugger
    const upFile = event.target.files[0];
    this.fileUpload(upFile, fileInput);

  }

  fileUpload(upFile: File, fileInput: HTMLInputElement) {
    const fileExt = upFile.name.split('.').pop();
    if (!this.accept.includes(`.${fileExt.toLowerCase()}`)) {
      this.alert.showAlert('Info', `${fileExt} file is not allowed. Only ${this.accept.join(',')} file is allowed.`, 'info', true).then(() => { return; })
    }
    else if (this.uploadFor === 'text') {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.description = fileReader.result as string;

      }
      fileReader.readAsText(upFile);
    }
    else if (this.uploadFor === 'image') {
      // this.index = this.productImage.length;
      this.index = this.isUpdate ? this.index : this.productImage().length;
      this.buildImage(upFile, fileInput, this.index);
    }

    fileInput.value = '';
  }

  buildImage(file: File, fileInput: HTMLInputElement, index: number) {
    this.fileService.loadImageAndCompress(file, this.accept, 200, 450, 450).then(async (r: any) => {
      debugger
      // this.productImage()[index] = r;

      this.productImage.update((items: string[]) => {
        if (this.isUpdate) {
          return items.map((value, i) => i == index ? r : value);
        } else {
          return [...items, r];
        }
      });

      this.isUpdate = false;
    })
      .catch(error => {
        this.alert.showAlert('Oppsss', error, 'error', true).then(() => fileInput.value = '');
      });
  }

  remveImage(index: number) {
    if (index > -1 && index < this.productImage().length)
      this.productImage().splice(index, 1);
  }

  updateImage(fileInput: HTMLInputElement, accept: string, index: number, uploadFor: 'text' | 'image' = 'image') {
    this.isUpdate = true;
    this.index = index;
    this.uploadFile(fileInput, accept, uploadFor);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isHovering = this.isValidDrag(event);
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isHovering = !this.isValidDrag(event);
  }

  onDrop(event: DragEvent, fileInput: HTMLInputElement, accept: string, uploadFor: 'text' | 'image' = 'image'): void {
    event.preventDefault();
    event.stopPropagation();
    this.isHovering = false;
    if (event.dataTransfer) {
      this.accept = accept.split(',').map(m => m.trim().toLowerCase());
      this.uploadFor = uploadFor;

      const droppedFiles = event.dataTransfer.files[0];
      // this.files.push(...droppedFiles);
      // this.buildImage(droppedFiles, fileInput, this.index);
      this.fileUpload(droppedFiles, fileInput);

    }
  }

  loadProductInfo() {
    const payload = {
      userId: this.cs.loadLoginUser()?.userId,
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_BY_USER, ContentType.Product, 'SELECT_ALL_BY_USER', payload);
  }

  private isValidDrag(event: DragEvent): boolean {
    return event.dataTransfer?.items.length > 0 && event.dataTransfer?.items[0].kind === 'file';
  }

  findSubCategory(event: any) {
    debugger
    const id = event.target.value;
    this.userProductInfo()[0]?.productCategories?.filter(m => m.categoryId == id).forEach(f => this.productSubCategories.push(...f.productSubCategories));
    console.log('sub cat', this.productSubCategories);

  }

  addProduct() {
    this.productInfo;
    debugger
  }

  // onSubmit(event){
  //   debugger
  // }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      this.alert.showAlert('OPSSSS', super.getErrorMsg(res), 'error');
      return;
    } else if (res.header.referance === 'SELECT_ALL_BY_USER') {
      console.log('product list ', res.payload);
      this.userProductInfo.set(res.payload);
    }
  }
  onError(service: Service, req: any, res: any) {
    this.alert.showAlert('Error', res?.error, 'error');
  }

}

