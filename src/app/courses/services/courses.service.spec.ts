import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES} from '../../../../server/db-data';
import {Course} from '../model/course';
import {HttpErrorResponse} from '@angular/common/http';

fdescribe('CourseService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
      coursesService.findAllCourses()
        .subscribe((courses) => {
          expect(courses)
            .toBeTruthy('No courses returned');
          expect(courses.length)
            .toBe(12, 'incorrect number of courses');
          const singleCourse = courses.find(course => course.id === 12);
          expect(singleCourse.titles.description)
            .toBe('Angular Testing Course');
        });

      const fakeReq = httpTestingController.expectOne('/api/courses');
      expect(fakeReq.request.method).toEqual('GET');
      fakeReq.flush({payload: Object.values(COURSES)
      });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12)
      .subscribe((course) => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });

    const fakeReq = httpTestingController.expectOne('/api/courses/12');
    expect(fakeReq.request.method).toBe('GET');
    fakeReq.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe((updatedCourse: Course) => {
        expect(updatedCourse.id).toBe(12);
      });
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description)
      .toEqual(changes.titles.description);
    req.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('sould give an error if save courses fails', () => {
    const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    req.flush('failing request', {status: 500, statusText: 'Internal Server Error'});
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
