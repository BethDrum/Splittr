import { StyleSheet, Text, View } from 'react-native';
//import { Section } from '@/components/section';


export default function SelectPerson() {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Person</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff'
    }
})