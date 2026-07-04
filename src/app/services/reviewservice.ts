import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Review } from '../models/Review';
import { ReviewsBelowAverageDTO } from '../models/reports/review/reviews-below-average-dto';
import { ReviewsReviewsLessorRatingDTO } from '../models/reports/review/reviews-reviews-lessor-rating-dto';
import { ReviewsReviewsNoReviewEstateDTO } from '../models/reports/review/reviews-reviews-no-review-estate-dto';
import { ReviewsReviewsRatingDistributionDTO } from '../models/reports/review/reviews-reviews-rating-distribution-dto';

@Injectable({
  providedIn: 'root',
})
export class Reviewservice {
  private url = `${environment.base}/Reviews`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Review[]>(this.url);
  }

  listMine() {
    return this.http.get<Review[]>(`${this.url}/my-reviews`);
  }

  insert(review: Review) {
    return this.http.post(this.url, review, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Review>(`${this.url}/listId/${id}`);
  }

  update(id: number, review: Review) {
    return this.http.put(`${this.url}/actualizar/${id}`, review,{ responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' });
  }
  belowAverage() {
    return this.http.get<ReviewsBelowAverageDTO[]>(`${this.url}/below-average`);
  }
 
  bestLessors() {
    return this.http.get<ReviewsReviewsLessorRatingDTO[]>(`${this.url}/best-lessors`);
  }
 
  noReviews() {
    return this.http.get<ReviewsReviewsNoReviewEstateDTO[]>(`${this.url}/no-reviews`);
  }
 
  ratingDistribution() {
    return this.http.get<ReviewsReviewsRatingDistributionDTO[]>(`${this.url}/rating-distribution`);
  }  
}
