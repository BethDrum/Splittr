import { StyleSheet, Text, View } from 'react-native';

type Props = {
    onPress: () => void;
    theme?: 'primary';
};

interface iRecieptSection {
    food: string;
    cost: string;
}

export default function recieptSection({food, cost}: iRecieptSection) {
    return(
        <View style={styles.cardWrapper}>
            <View style = {styles.mainCard}>
                <Text>{food}</Text>
                <Text>{cost}</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    mainCard: {
        width: '100%',
        //borderWidth: 2,
        // borderColor: '#efc631',
        flex: 1,
        backgroundColor: '#C8D3B7',
        margin: 5,
        borderRadius: 15,
        color: '#FFFDF2',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    secondaryCard: {
        width: '100%',
        flex: 1,
        margin: 5,
        borderRadius: 15,
        color: '#FFFDF2',
        flexDirection: 'row',
    },
    iconBox: {
        backgroundColor: '#D4E0F3',
        width: '30%',
        height: '80%',
        borderRadius: 15,
    },
    cardWrapper: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start',
    },
    textPrimary: {
        color: '#FFFDF2',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
        padding: '5%',
    },
    textSecondary: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingLeft: '5%',
    },
    imageWrapper: {
        flex: 1,
        alignSelf: 'flex-end',
        position: 'absolute',
        marginTop: '5%',
    },
    image: {
        flex: 1,
    }
});