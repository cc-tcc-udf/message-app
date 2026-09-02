import { NgStyle, TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@components/course/course.service';
import { UsersService } from '@components/users/users.service';
import { Course, SubCourse } from '@models/Course';
import { Column } from '@models/primeng';
import { CustomUsuario, getColumnsUser, Usuario } from '@models/Usuario';
import { ErrosComponent } from '@shared/errors.component';
import { ListSkeletonComponent } from '@shared/skeletons/list-skeleton/list-skeleton.component';
import { ThemeService } from '@utils/services/theme.service';
import { extractColors } from 'extract-colors';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { PanelBeforeToggleEvent, PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [NgStyle, TitleCasePipe, MenuModule, PanelModule, ButtonModule, TableModule, ListSkeletonComponent, ErrosComponent, SkeletonModule],
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.scss',
  viewProviders: [DialogService]
})
export class ViewCourseComponent implements OnInit {
  course!: Course;
  backgroundColor = signal('');
  alunosMap = new Map<string, CustomUsuario[]>();
  loadingAlunos = new Map<string, boolean>();
  id!: string;
  skeleton = true;
  cols: Column[] = getColumnsUser();

  private destroyRef = inject(DestroyRef);

  constructor(
    private service: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService,
    private userService: UsersService,
    private theme: ThemeService,
    private cr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params['id'];
        if (id) {
          this.id = id;
          this.getCourse(id);
        } else {
          this.skeleton = false;
        }
      });
  }

  private getCourse(id: string) {
    this.service.getById(id).subscribe((p) => {
      if (p.success) {
        this.course = p.data as Course;
        if (this.course?.resp?.profilePhoto?.url) {
          this.extract(this.course?.resp?.profilePhoto?.url);
          this.skeleton = false;
        } else {
          this.extract('assets/img/svg/photo.svg');
          this.skeleton = false;
        }
      } else {
        this.skeleton = false;
      }
    });
  }

  getUrl() {
    const user = this.course?.resp;
    return user.profilePhoto ? user.profilePhoto?.url : 'assets/img/svg/photo.svg';
  }

  extract(imageUrl: string): void {
    extractColors(imageUrl)
      .then((colors) => {
        const dominantColor = colors.sort((a, b) => b.area - a.area)[0];
        const hexColor = dominantColor.hex;
        this.backgroundColor.set(hexColor);

        console.log(`Cor extraída: ${hexColor}`);
      })
      .catch(console.error);
  }

  handlePanelToggle($event: PanelBeforeToggleEvent, c: SubCourse) {
    if ($event.collapsed && c.id) {
      this.getAlunosByIdCourse(c.id);
    }
  }

  getAlunosByIdCourse(id: string) {
    this.loadingAlunos.set(id, true);
    this.userService.getAlunos(id).subscribe({
      next: (p) => {
        if (p.success) {
          this.loadUsers(id, p.data as Usuario[]);
        }
      },
      error: (err) => {
        console.error('Erro ao buscar alunos:', err);
        this.loadingAlunos.set(id, false);
      },
      complete: () => {
        setTimeout(() => {
          this.loadingAlunos.set(id, false);
        })
        // this.loading(id, false, 500);;
        this.cr.detectChanges();
      },
    });
  }

  async loadUsers(id: string, users: Usuario[]): Promise<void> {
    try {
      const userPromises = users.map(async (usr) => {
        const user = new CustomUsuario(usr);
        if (user.profilePhoto) {
          user.color = await this.theme.extractCor(user.profilePhoto);
        }
        return user;
      });
      const usrs = await Promise.all(userPromises);
      this.alunosMap.set(id, usrs);
      console.log(usrs);
      this.cr.detectChanges();
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  getAlunos(c: SubCourse): CustomUsuario[] {
    if (!c.id) return [];
    if (this.loadingAlunos.get(c.id)) return [];
    return this.alunosMap.get(c.id) || [];
  }


  getPicture(user: Usuario) {
    return user?.profilePhoto ?? 'assets/img/svg/photo.svg';
  }

  loading(id: string, is: boolean, time: number) {
    setTimeout(() => {
      this.loadingAlunos.set(id, is);
      console.log(this.loadingAlunos)
    }, time);
  }
}
