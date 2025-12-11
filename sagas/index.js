import { all } from 'redux-saga/effects';
import upcomingEventsSaga from './upcomingEventsSaga';

export default function* rootSaga() {
  yield all([
    upcomingEventsSaga(),
  ]);
}