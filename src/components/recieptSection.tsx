import { StyleSheet, Text, View } from 'react-native';

interface iRecieptSection {
    food: string;
    cost: string;
}

export default function recieptSection({food, cost}: iRecieptSection) {
    return(
        <View style={styles.cardWrapper}>
            <View style = {styles.mainCard}>
                <Text style={styles.food}>{food}</Text>
                <View style={styles.dottedLine}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <View key={i} style={styles.singleDot}/>
                    ))}
                </View>
                <Text style={styles.cost}>{cost}</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    mainCard: {
        width: '100%',
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
    food: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingLeft: '5%',
    },
    cost: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingRight: '5%',
    },
    dottedLine: {
        flex: 1,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        paddingTop: '2%',
    },
    singleDot:{
        width: 6,
        height: 2,
        backgroundColor: '#4F4F4F',
        borderRadius: 1,
    }
});