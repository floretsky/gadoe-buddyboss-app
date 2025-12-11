import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  upcomingEventsFetchRequest,
} from '../actions/upcomingEventsActions';

const UpcomingEventsBlock = (props) => {
  const {
    block,
    wrapStyle,
    appBossWrapStyle,
    fontFamilyStyle,
    colors,
  } = props;

  const dispatch = useDispatch();
  const lastApiParamsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const {
    events,
    loading,
    loaded,
    errorMessage,
  } = useSelector((state) => state.upcomingEventsBlock);

  // Build params from data_source like in the docs
  const apiParams = useMemo(() => {
    const ds = block?.data?.data_source;
    if (!ds || !ds.route) return null;

    return {
      endpoint: `wp-json${ds.route}`, // e.g. wp-json/gadoe/v1/upcoming-events
      ...(ds.request_params || {}),
    };
  }, [
    block?.data?.data_source?.route,
    block?.data?.data_source?.request_params,
  ]);

  const apiParamsString = useMemo(
    () => (apiParams ? JSON.stringify(apiParams) : null),
    [apiParams]
  );

  const fetchEvents = useCallback(() => {
    if (!apiParams) return;

    if (lastApiParamsRef.current === apiParamsString) {
      return; // already fetched
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      lastApiParamsRef.current = apiParamsString;
      dispatch(upcomingEventsFetchRequest(apiParams));
    }, 300);
  }, [apiParams, apiParamsString, dispatch]);

  useEffect(() => {
    if (apiParams && apiParamsString !== lastApiParamsRef.current) {
      fetchEvents();
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [apiParams, apiParamsString, fetchEvents]);

  const renderItem = useCallback(
    ({ item }) => {
      const title =
        item.title?.rendered ||
        item.post_title ||
        item.title ||
        'Untitled event';

      const date =
        item._start_date ||
        item.start_date ||
        item.event_date ||
        item.date ||
        '';

      return (
        <View style={{ marginBottom: 8 }}>
          <Text style={[{ fontWeight: '600' }, fontFamilyStyle]}>
            {title}
          </Text>
          {!!date && (
            <Text style={fontFamilyStyle}>{date}</Text>
          )}
        </View>
      );
    },
    [fontFamilyStyle]
  );

  const keyExtractor = useCallback(
    (item, index) =>
      item.id?.toString() ||
      item.ID?.toString() ||
      `event-${index}`,
    []
  );

  return (
    <View style={[{ padding: 16 }, appBossWrapStyle, wrapStyle]}>
      {block?.data?.title && (
        <Text
          style={[
            {
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 10,
              color: colors?.bodyText || '#000',
            },
            fontFamilyStyle,
          ]}
        >
          {block.data.title}
        </Text>
      )}

      {loading && <ActivityIndicator />}

      {!!errorMessage && !loading && (
        <Text style={[{ color: 'red', marginTop: 8 }, fontFamilyStyle]}>
          {errorMessage}
        </Text>
      )}

      {!loading && !errorMessage && loaded && events?.length === 0 && (
        <Text style={fontFamilyStyle}>No upcoming events.</Text>
      )}

      {events?.length > 0 && (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default UpcomingEventsBlock;