import React, { useEffect, useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
// Adjust this import to however your app stores the site URL:

const UpcomingEventsBlock = (props) => {
  const { block, wrapStyle, fontFamilyStyle, colors } = props;

  const dispatch = useDispatch();
  const lastApiParamsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Adapt to your reducer name
  const { events, loading, loaded, errorMessage } = useSelector(
    (state) => state.upcomingEventsBlock
  );

  const apiParams = useMemo(() => {
    if (!block?.data?.data_source) return null;
    return {
      endpoint: `wp-json${block.data.data_source.route}`,
      ...block.data.data_source.request_params,
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
      return;
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

  const renderItem = ({ item }) => {
    const title =
      item.title?.rendered || item.post_title || item.title || 'Untitled event';

    const date = item.start_date || item._start_date || '';

    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={[{ fontWeight: '600' }, fontFamilyStyle]}>{title}</Text>
        {!!date && <Text style={fontFamilyStyle}>{date}</Text>}
      </View>
    );
  };

  const keyExtractor = (item, index) =>
    item.id?.toString() || item.ID?.toString() || `event-${index}`;

  return (
    <View style={[{ padding: 16 }, wrapStyle]}>
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

      {loading && !loaded && <Text style={fontFamilyStyle}>Loading…</Text>}

      {!!errorMessage && (
        <Text style={[{ color: 'red' }, fontFamilyStyle]}>{errorMessage}</Text>
      )}

      {loaded && !loading && (!events || events.length === 0) && (
        <Text style={fontFamilyStyle}>No upcoming events.</Text>
      )}

      {events && events.length > 0 && (
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
