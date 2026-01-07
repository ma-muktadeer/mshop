import { Component, Input, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { DateConvertService } from 'src/app/ithouse/services/date-convert.service';
import { FileService } from 'src/app/ithouse/services/file.service';
import { Service } from 'src/app/ithouse/services/service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { EditProfile } from './edit-profile/edit-profile';
import { Spinner } from "src/app/structure/shared/components/spinner/spinner";
import { RequestBody } from 'src/app/ithouse/constants/RequestBody';


@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile extends Ithouse implements Service {

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

  coverImage = signal<string>('');
  profileImage = signal<string>('');
  loading = signal<boolean>(false);
  userDetails: any;
  loads: any;

  // userInfo: any;
  constructor(
    private fileService: FileService,
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
    this.loading.update(() => true);
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
        this.coverImage.update(() => value);
      })
        .catch(error => {
          Swal.fire('Oppsss', error, 'error');
          fileInput.value = '';
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
        this.profileImage.update(() => r);

      })
        .catch(error => {
          Swal.fire('Oppsss', error, 'error');
          fileInput.value = '';
        });
    }
  }

  onResponse(service: Service, req: RequestBody<any>, res: any) {
    this.loading.update(() => false);
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    } else if (req.header.reference === 'LOAD_DETAILS') {
      this.userDetails = res.payload;
      this.profileImage.update(() => this.userDetails?.profileImagePath ?? this.profileImage());
      this.coverImage.update(() => this.userDetails?.profileBannerPath ?? this.coverImage());
    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading.update(() => false);
    Swal.fire(`${res?.statusText} with error code:${res?.status}`, 'error');
    throw new Error('Method not implemented.');
  }

  private tempRef = EditProfile;
  editProfile() {
    const openRef = this.ngModel.open(this.tempRef, { backdrop: 'static', size: 'lg' });
    openRef.componentInstance.userDetails = this.userDetails;
    openRef.closed.subscribe(res => {
      console.log('close model: ', res);
      if (!res) {
        Swal.fire('Error', 'Can not save User information', 'error');
      }
      else if (typeof res === 'string' || res instanceof String) {
        return;
      } else {
        this.userDetails = res;
        Swal.fire('Success', 'User information updated', 'success');
      }

    });
  }
}
