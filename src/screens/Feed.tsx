import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
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

interface Pagination {
  data: Event[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  useEffect(() => {
    const fetchEvents = async (page: number) => {
      setIsLoading(true);
      try {
        const response = await api.get<Pagination>(`/events?page=${page}`)
        const { data, meta } = response.data
        setEvents(data)
        setCurrentPage(meta.current_page)
        setLastPage(meta.last_page)
      } catch (error) {
        console.log("Error fetching events: ", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents(currentPage);

  }, [currentPage]);

  const groupEventsByDay = (events: Event[]) => {
    return events.reduce((groups, event) => {
      const date = event.day;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {} as { [key: string]: Event[] });
  }

  if (isLoading && events.length === 0) {
    return (
      <View style={styles.loadingView}>
        <Text style={styles.loadingText}>
          Carregando eventos...
        </Text>
        <ActivityIndicator size="large" color="#f0b13f" />
      </View>
    )
  }

  const groupedEvents = groupEventsByDay(events);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Jogos Olímpicos Paris 2024
        </Text>
      </View>

      <View style={[styles.pagination, styles.topPagination]}>
        <View style={styles.paginationButton}>
          <TouchableOpacity
            onPress={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            activeOpacity={0.7}
          >
            <Text>Anterior</Text>
          </TouchableOpacity>
        </View>
        <Text>{`${currentPage} / ${lastPage}`}</Text>
        <View style={styles.paginationButton}>
          <TouchableOpacity
            onPress={() => setCurrentPage(prevPage => Math.min(prevPage + 1, lastPage))}
            disabled={currentPage === lastPage}
          >
            <Text>Próximo</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View>
        <Text>Filtro</Text>
      </View>


      <FlatList
        data={Object.keys(groupedEvents)}
        keyExtractor={item => item}
        renderItem={({ item: day }) => (
          <View>
            <Text style={styles.date}>{day}</Text>
            {groupedEvents[day].map((event, index) => (
              <EventCard key={`${event.id}-${index}`} event={event} />
            ))}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.pagination}>
            
          </View>
        }
      />
    </View>
  );
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.discipline}>{event.discipline_name}</Text>
      <FlatList
        data={event.competitors}
        keyExtractor={(item, index) => `${item.country_id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.competitor}>
            <Image source={{ uri: item.country_flag_url }} style={styles.flag} />
            <Text>{item.competitor_name} - {item.result_mark}</Text>
          </View>
        )}
      />
    </TouchableOpacity>
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
    marginTop: 10,
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
    padding: 15,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 150,
    margin: 10,
    
  },
  topPagination: {
    marginBottom: 0,
  },
  paginationButton: {
    marginHorizontal: 40,
    borderRadius: 15,
    borderColor: "#000",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#f0b13f",
    paddingHorizontal: 20,
  },
});

export default EventsList;
