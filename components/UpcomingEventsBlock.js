import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { getApi } from "@src/services";

const UpcomingEventsBlock = (props) => {
  const { block, wrapStyle, fontFamilyStyle, colors, config, accessToken } = props;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Build a "suffix" URL like: wp-json/gadoe/v1/upcoming-events?per_page=5
  const request = useMemo(() => {
    const ds = block?.data?.data_source;
    if (!ds?.route) return null;

    const params = ds.request_params || {};
    const query = new URLSearchParams(params).toString();

    // If PHP sends '/gadoe/v1/upcoming-events', we want 'wp-json/gadoe/v1/upcoming-events'
    let route = ds.route.startsWith("/") ? ds.route : `/${ds.route}`;
    const suffix = `wp-json${route}${query ? `?${query}` : ""}`;

    // Optional: if ds.route is a full URL, pass it through and set isFullUrl=true
    const isFullUrl = /^https?:\/\//i.test(ds.route);
    const url = isFullUrl ? (query ? `${ds.route}${ds.route.includes("?") ? "&" : "?"}${query}` : ds.route) : suffix;

    return { url, isFullUrl };
  }, [block?.data?.data_source]);

  useEffect(() => {
    if (!request) return;

    let mounted = true;
    setLoading(true);
    setErrorMsg("");

    const api = getApi(config);

    api
      .customRequest(
        request.url,        // suffix ("wp-json/...") OR full URL
        "get",
        {},
        null,
        // If your endpoint is protected, you likely need this header:
        accessToken ? { accessToken } : {},
        request.isFullUrl   // true if full URL, false if suffix
      )
      .then((response) => {
        if (!mounted) return;
        const data = response?.data;
        const items = Array.isArray(data) ? data : data?.events || [];
        setEvents(items);
      })
      .catch((e) => {
        if (!mounted) return;
        setErrorMsg(e?.message || "Failed to load events.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [request, config, accessToken]);

  return (
    <View style={[{ paddingHorizontal: 16, paddingVertical: 12 }, wrapStyle]}>
      {!!block?.data?.title && (
        <Text
          style={[
            { fontSize: 18, fontWeight: "700", marginBottom: 10, color: colors?.bodyText || "#000" },
            fontFamilyStyle,
          ]}
        >
          {block.data.title}
        </Text>
      )}

      {loading && <ActivityIndicator />}

      {!!errorMsg && !loading && (
        <Text style={[{ color: "red" }, fontFamilyStyle]}>{errorMsg}</Text>
      )}

      {!loading && !errorMsg && events?.length === 0 && (
        <Text style={fontFamilyStyle}>No upcoming events.</Text>
      )}

      {events?.length > 0 && (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.id?.toString() || item.ID?.toString() || `event-${index}`}
          renderItem={({ item }) => {
            const title = item.title?.rendered || item.post_title || item.title || "Untitled event";
            const date = item._start_date || item.start_date || item.event_date || item.date || "";
            return (
              <View style={{ marginBottom: 8 }}>
                <Text style={[{ fontWeight: "600" }, fontFamilyStyle]}>{title}</Text>
                {!!date && <Text style={fontFamilyStyle}>{date}</Text>}
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Adjust these to match your app’s redux shape.
// BuddyBoss docs explicitly mention props.config and props.accessToken patterns. 
const mapStateToProps = (state) => ({
  config: state?.config,                 // or state?.settings?.config, etc.
  accessToken: state?.auth?.accessToken, // or state?.user?.token, etc.
});

export default connect(mapStateToProps)(UpcomingEventsBlock);