import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/events')
      .then(response => {
        setEvents(response.data.data);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching events:', error);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>
          Carregando eventos...
        </Text>
        <ActivityIndicator size="large" color="#f0b13f" />
      </View>
    )
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Jogos Olímpicos Paris 2024
        </Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
      />
    </View>
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
  header: {
    backgroundColor: "#e8354b",
    padding: 30,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    alignItems: "center",
  },
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  loadingText: {
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 18,
  },
});

export default EventsList;
