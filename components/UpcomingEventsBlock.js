import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// Adjust this import to however your app stores the site URL:
import Config from 'react-native-config'; // or from your app config file

const WP_BASE_URL = (
  Config.WP_BASE_URL || 'https://community.gadoe.org'
).replace(/\/$/, '');

const UpcomingEventsBlock = (props) => {
  const {
    block, // block data from API (includes data_source, title, etc.)
    wrapStyle, // container styles passed by app
    fontFamilyStyle, // typography style
    colors, // theme colors
  } = props;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const apiUrl = useMemo(() => {
    const ds = block?.data?.data_source;
    if (!ds || !ds.route) return null;

    const params = ds.request_params || {};

    // Build query string safely
    const query = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            String(params[key])
          )}`
      )
      .join('&');

    let route = ds.route;

    if (/^https?:\/\//i.test(route)) {
      return query
        ? `${route}${route.includes('?') ? '&' : '?'}${query}`
        : route;
    }

    // Normalize route (what we currently send from PHP: "/gadoe/v1/upcoming-events")
    if (!route.startsWith('/')) {
      route = `/${route}`;
    }

    // Final REST URL: https://community.gadoe.org/wp-json/gadoe/v1/upcoming-events?per_page=5
    let url = `${WP_BASE_URL}/wp-json${route}`;
    if (query) {
      url += (url.includes('?') ? '&' : '?') + query;
    }

    return url;
  }, [block?.data?.data_source]);

  useEffect(() => {
    if (!apiUrl) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg('');

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;

        // Our endpoint returns { events: [...] }
        const items = Array.isArray(json) ? json : json.events || [];
        setEvents(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        // This will show "Network request failed" in the UI like you saw
        setErrorMsg(err.message || 'Network request failed');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const renderItem = ({ item }) => {
    const title =
      item.title?.rendered || item.post_title || item.title || 'Untitled event';

    const date =
      item.start_date || item._start_date || item.event_date || item.date || '';

    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={[{ fontWeight: '600' }, fontFamilyStyle]}>{title}</Text>
        {!!date && <Text style={fontFamilyStyle}>{date}</Text>}
      </View>
    );
  };

  return (
    <View style={[{ paddingHorizontal: 16, paddingVertical: 12 }, wrapStyle]}>
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

      {!!errorMsg && !loading && (
        <Text style={[{ color: 'red' }, fontFamilyStyle]}>{errorMsg}</Text>
      )}

      {!loading && !errorMsg && events?.length === 0 && (
        <Text style={fontFamilyStyle}>No upcoming events.</Text>
      )}

      {events?.length > 0 && (
        <FlatList
          data={events}
          keyExtractor={(item, index) =>
            item.id?.toString() || item.ID?.toString() || `event-${index}`
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default UpcomingEventsBlock;
