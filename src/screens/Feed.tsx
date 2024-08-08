import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Button, Modal, TouchableOpacity } from 'react-native';
import { api } from '../lib/axios';
import { Calendar, DateData } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';

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
  gender_code: string;
  competitors: Competitor[];
}

interface Pagination {
  data: Event[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

interface Discipline {
  id: number;
  name: string;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [filters, setFilters] = useState<{ discipline_name: string; gender_code: string; day: string | undefined }>({ discipline_name: '', gender_code: '', day: undefined });
  const [disciplines, setDisciplines] = useState<{ label: string; value: string }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [openDisciplineDropdown, setOpenDisciplineDropdown] = useState<boolean>(false);
  const [openGenderDropdown, setOpenGenderDropdown] = useState<boolean>(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  

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

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await api.get<{ data: Discipline[] }>('/disciplines');
        setDisciplines(response.data.data.map(discipline => ({ label: discipline.name, value: discipline.name })));
      } catch (error) {
        console.error('Error fetching disciplines:', error);
      }
    };

    fetchDisciplines();
  }, []);

  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      discipline_name: selectedDiscipline || '',
    }));
  }, [selectedDiscipline]);

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

  const applyFilters = (events: Event[]) => {
    const filtered = events.filter(event => {
      const { discipline_name, gender_code, day } = filters;
      const matchesDiscipline = discipline_name ? event.discipline_name === discipline_name : true;
      const matchesGender = gender_code ? event.gender_code === gender_code : true;
      const matchesDay = day ? event.day === day : true;
      return matchesDiscipline && matchesGender && matchesDay;
    });
    return filtered;
  };

  const filteredEvents = applyFilters(events);
  const groupedEvents = groupEventsByDay(filteredEvents);

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

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>
            Filtrar por:
          </Text>
        </TouchableOpacity>

        <Modal
          animationType='slide'
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible)
          }}
        >
          <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por:</Text>
            
            <DropDownPicker
              open={openDisciplineDropdown}
              value={filters.discipline_name}
              items={disciplines}
              setOpen={setOpenDisciplineDropdown}
              setValue={(value) => setFilters({ ...filters, discipline_name: value as unknown as string })}
              placeholder="Selecionar Modalidade"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
            <DropDownPicker
              open={openGenderDropdown}
              value={selectedGender}
              items={[
                { label: 'Todos os Gêneros', value: '' },
                { label: 'Masculino', value: 'M' },
                { label: 'Feminino', value: 'W' }
              ]}
              setOpen={setOpenGenderDropdown}
              setValue={setSelectedGender}
              placeholder="Selecionar Gênero"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            <Calendar
              onDayPress={(day: DateData) => setFilters({ ...filters, day: day.dateString })}
              markedDates={{
                [filters.day || '']: { selected: true, marked: true, selectedColor: 'blue' }
              }}
            />
            <Button title="Aplicar Filtros" onPress={() => {
              setFilters(prevFilters => ({
                ...prevFilters,
                discipline_name: selectedDiscipline || '',
                gender_code: selectedGender || '',
              }))
              setIsModalVisible(false)
            }} />
          </View>
        </View>
        </Modal>
        
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
  filterContainer: {

  },
  filterButton: {
    backgroundColor: '#008CBA',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 10,
    borderColor: '#cccccc',
  },
  dropdownContainer: {
    borderColor: '#cccccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
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
