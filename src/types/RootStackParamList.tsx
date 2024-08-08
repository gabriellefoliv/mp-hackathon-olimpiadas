import { StackNavigationProp } from '@react-navigation/stack'

export type RootStackParamList = {
    Home: undefined;
    Feed: undefined;

}

export type NavigationProps<T extends keyof RootStackParamList> = {
    navigation: StackNavigationProp<RootStackParamList, T>;
}