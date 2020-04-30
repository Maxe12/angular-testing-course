import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {COURSES} from '../../../../server/db-data';

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
      fakeReq.flush({payload: Object.values(COURSES)});
  });
});
