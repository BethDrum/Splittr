import { StyleSheet, Text, View } from 'react-native';


interface GuestSection {
    name: string;
    image?: string;
}

export default function GuestSection({name}: GuestSection) {
    
    return(
        <View style={styles.cardWrapper}>
            {/* {(image && (
                <Image source={{ uri: image}} style={styles.avatar}/>
            ) */}

            {/* )} */}
            <View style = {styles.mainCard}>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    );
}


export const styles = StyleSheet.create({
    mainCard: {
        flex: 1,
        backgroundColor: '#FFFDF2',
        margin: 5,
        borderRadius: 10,
        color: '#4F4F4F',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardWrapper: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start',
    },
    name: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingLeft: '5%',
    },
    avatar: {
        
    },
    input: {

    }
});