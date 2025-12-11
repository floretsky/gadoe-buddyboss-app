import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";

const UpcomingEventsBlock = (props) => {
  const {
    block,               // block data from API (includes data_source, title, etc.)
    wrapStyle,           // container styles passed by app
    fontFamilyStyle,     // typography style
    colors,              // theme colors
  } = props;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const apiParams = useMemo(() => {
    const ds = block?.data?.data_source;
    if (!ds || !ds.route) return null;

    const base = `wp-json${ds.route}`; // e.g. wp-json/gadoe/v1/upcoming-events
    const params = ds.request_params || {};
    const query = new URLSearchParams(params).toString();

    return query ? `${base}?${query}` : base;
  }, [block?.data?.data_source]);

  useEffect(() => {
    if (!apiParams) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg("");

    fetch(apiParams)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;

        // Adjust depending on your endpoint shape:
        // if you return { events: [...] }, use json.events
        const items = Array.isArray(json) ? json : json.events || [];
        setEvents(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err.message || "Failed to load events.");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiParams]);

  const renderItem = ({ item }) => {
    const title =
      item.title?.rendered ||
      item.post_title ||
      item.title ||
      "Untitled event";

    const date =
      item._start_date || item.event_date || item.date || "";

    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={[{ fontWeight: "600" }, fontFamilyStyle]}>{title}</Text>
        {!!date && (
          <Text style={fontFamilyStyle}>{date}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={[{ padding: 16 }, wrapStyle]}>
      {block?.data?.title && (
        <Text
          style={[
            {
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 10,
              color: colors?.bodyText || "#000",
            },
            fontFamilyStyle,
          ]}
        >
          {block.data.title}
        </Text>
      )}

      {loading && <ActivityIndicator />}

      {!!errorMsg && !loading && (
        <Text style={[{ color: "red" }, fontFamilyStyle]}>
          {errorMsg}
        </Text>
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
