// app/src/sagas/upcomingEventsSaga.js

import { takeLatest, call, put } from 'redux-saga/effects';
import {
  UPCOMING_EVENTS_FETCH_REQUEST,
  upcomingEventsFetchSuccess,
  upcomingEventsFetchFailed,
} from '../actions/upcomingEventsActions';
import { apiFetch } from '../utils/api'; 

function* doUpcomingEventsFetch({ params }) {
  try {
    const { endpoint, ...queryParams } = params;

    const response = yield call(apiFetch, endpoint, queryParams, 'GET');

    const events = Array.isArray(response)
      ? response
      : response.events || [];

    yield put(upcomingEventsFetchSuccess(events));
  } catch (e) {
    yield put(
      upcomingEventsFetchFailed(e?.message || 'Network request failed')
    );
  }
}

export default function* upcomingEventsSaga() {
  yield takeLatest(UPCOMING_EVENTS_FETCH_REQUEST, doUpcomingEventsFetch);
}