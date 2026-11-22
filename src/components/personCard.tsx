import { StyleSheet, Text, View } from 'react-native';


interface GuestSection {
    name: string;
    image?: string;
}

export default function PersonCard({name}: GuestSection) {
    
    return(
        <View style={styles.cardWrapper}>
            <View>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    );
}


export const styles = StyleSheet.create({
    cardWrapper: {
        alignSelf: 'center',
        backgroundColor: '#FFFDF2',
        borderRadius: 15,
        margin: '1%',
        width: '100%',
    },
    name: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 25,
        padding: '2%', 
        paddingLeft: '5%',
    },
});