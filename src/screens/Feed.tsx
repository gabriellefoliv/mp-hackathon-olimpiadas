import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { api } from '../lib/axios';

interface Competitor {
  country_id: string;
  country_flag_url: string;
  competitor_name: string;
  result_mark: string;
}

interface Event {
  id: number;
  day: string;
  discipline_name: string;
  competitors: Competitor[];
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/events')
      .then(response => {
        setEvents(response.data.data);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching events:', error);
      });
  }, []);

  if (error) {
    return <View><Text>Error: {error}</Text></View>;
  }

  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <EventCard event={item} />}
    />
  );
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{event.day}</Text>
      <Text style={styles.discipline}>{event.discipline_name}</Text>
      <FlatList
        data={event.competitors}
        keyExtractor={item => item.country_id}
        renderItem={({ item }) => (
          <View style={styles.competitor}>
            <Image source={{ uri: item.country_flag_url }} style={styles.flag} />
            <Text>{item.competitor_name} - {item.result_mark}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discipline: {
    fontSize: 16,
    marginVertical: 10,
  },
  competitor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  flag: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default EventsList;
