import { StackNavigationProp } from '@react-navigation/stack'

export type RootStackParamList = {
    Home: undefined;
    Feed: undefined;
    Game: undefined;
    Teams: undefined;
}

export type NavigationProps<T extends keyof RootStackParamList> = {
    navigation: StackNavigationProp<RootStackParamList, T>;
}