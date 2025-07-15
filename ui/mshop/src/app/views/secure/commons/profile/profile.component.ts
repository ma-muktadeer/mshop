import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { AlertService } from '../../../../ithouse/common/alert.service';
import { CommonService } from '../../../../ithouse/common/common.service';
import { DateConvertService } from '../../../../ithouse/common/date-convert.service';
import { FileService } from '../../../../ithouse/common/file.service';
import { Service } from '../../../../ithouse/common/service';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';
import { SpinnerComponent } from "../../../../layout/theme/pages/shared/components/spinner/spinner.component";
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends Ithouse implements Service, OnInit {


  imgFile: string[] = ['.jpg', '.jpeg', '.png', '.gif'];

  // name: string = "John Doe";
  about: string = "I'm just a regular person who loves coding!";
  work: string = "Software Engineer";
  education: string = "Bachelor's in Computer Science";
  location: string = "New York City";
  hometown: string = "Los Angeles";
  relationshipStatus: string = "Single";
  // birthday: string = "January 1, 1990";
  contactInfo: string = "john.doe@example.com";
  interests: string[] = ["Coding", "Reading", "Traveling"];
  favoriteQuotes: string[] = ["The only way to do great work is to love what you do.", "Stay hungry, stay foolish."];

  coverImage: string = 'https://via.placeholder.com/150'; // Placeholder URL for cover image
  profileImage: string = 'https://via.placeholder.com/150'; // Placeholder URL for profile image
  loading: boolean = false;
  userDetails: any;
  loads: any;

  // userInfo: any;
  constructor(
    private fileService: FileService,
    private alert: AlertService,
    private cs: CommonService,
    private ngModel: NgbModal,
    private dateservice: DateConvertService
  ) {
    super();
    this.loads = [
      { id: 1, name: 1 },
      { id: 2, name: 2 },
      { id: 3, name: 3 },
      { id: 4, name: 4 },
      { id: 5, name: 5 },
      { id: 6, name: 6 },
    ]
  }

  ngOnInit(): void {
    // this.userInfo = this.cs.loadLoginUser();
    this.loadUserInformation();
  }

  loadUserInformation() {
    this.loading = true;
    const payload = {
    }
    this.cs.sendRequest(this, ActionType.LOAD_DETAILS, ContentType.User, 'LOAD_DETAILS', payload);
  }

  coverImageUpload(fileInput: HTMLInputElement) {

    fileInput.click();
  }
  profileImageUpload(fileInput: HTMLInputElement) {
    debugger
    fileInput.click();
  }
  dateFormate(date: any): string {
    return this.dateservice.convertDb2Date(date, 'MMMM d, y');
  }
  onCoverImageChange(event: any, fileInput: HTMLInputElement) {
    debugger
    const file = event.target.files[0];
    if (file) {
      this.fileService.loadImageAndCompress(file, this.imgFile, 512, 1200, 450).then(async (value) => {
        debugger
        (await this.fileService.saveFile([value], 'PROFILE_BANNER')).subscribe(event => {
          if (event.type === HttpEventType.ResponseHeader) {
            const contentDisposition = event.headers.get('content-disposition');
            if (contentDisposition) {
              const matches = contentDisposition.match(/filename="([^"]+)"/);
              if (matches && matches.length > 1) {
                // fileName = matches[1];
              }
            }
          } else if (event.type === HttpEventType.DownloadProgress) {
            // this.progress = Math.round((event.loaded * 100) / event.total);
          } else if (event.type === HttpEventType.Response) {
            const body = event.body as BlobPart;
            const blob = new Blob([body], { type: event.headers.get('content-type') });

          }
        });
        this.coverImage = value;
      })
        .catch(error => {
          this.alert.showAlert('Oppsss', error, 'error', true).then(() => fileInput.value = '');
        });
    }
  }

  onProfileImageChange(event: any, fileInput: HTMLInputElement) {
    const file = event.target.files[0];
    if (file) {
      this.fileService.loadImageAndCompress(file, this.imgFile, 100, 300, 300).then(async r => {
        (await this.fileService.saveFile([r], 'PROFILE')).subscribe(event => {
          if (event.type === HttpEventType.ResponseHeader) {
            const contentDisposition = event.headers.get('content-disposition');
            if (contentDisposition) {
              const matches = contentDisposition.match(/filename="([^"]+)"/);
              if (matches && matches.length > 1) {
                // fileName = matches[1];
              }
            }
          } else if (event.type === HttpEventType.DownloadProgress) {
            // this.progress = Math.round((event.loaded * 100) / event.total);
          } else if (event.type === HttpEventType.Response) {
            const body = event.body as BlobPart;
            const blob = new Blob([body], { type: event.headers.get('content-type') });

          }
        });
        this.profileImage = r;

      })
        .catch(error => {
          this.alert.showAlert('Oppsss', error, 'error', true);
          fileInput.value = '';
        });
    }
  }

  onResponse(service: Service, req: any, res: any) {
    this.loading = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    } else if (res.header.referance === 'LOAD_DETAILS') {
      this.userDetails = res.payload;
      this.profileImage = this.userDetails?.profileImagePath ?? this.profileImage;
      this.coverImage = this.userDetails?.profileBannerPath ?? this.coverImage;
    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    this.alert.showAlert('Error', `${res?.statusText} with error code:${res?.status}`, 'error');
    throw new Error('Method not implemented.');
  }


  @Input()
  private tempRef = EditProfileComponent;
  editProfile() {
    const openRef = this.ngModel.open(this.tempRef, { backdrop: 'static', size: 'lg' });
    openRef.componentInstance.userDetails = this.userDetails;
    openRef.closed.subscribe(res => {
      console.log('close model: ', res);
      if (!res) {
        this.alert.showAlert('Error', 'Can not save User information', 'error', true);
      }
      else if (typeof res === 'string' || res instanceof String) {
        return;
      } else {
        this.userDetails = res;
        this.alert.showAlert('Success', 'User information updated', 'success', true);
      }

    });
  }

}
