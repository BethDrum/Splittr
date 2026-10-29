import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    onPress: () => void;
    theme?: 'title';
};

export default function Card({ onPress }: Props) {
    return(
        <View style={styles.cardWrapper}>
        <View style = {styles.mainCard}>
            <Pressable onPress={onPress}>
                <Text style={styles.text}>ADD   NEW   RECEIPT</Text>
            </Pressable>
            <View style={styles.imageWrapper}>
                <Image style={styles.image} source={require('../../assets/images/reciept.png')} />
            </View>
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
    cardWrapper: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start',
    },
    text: {
        color: '#FFFDF2',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
        padding: '5%',
    },
    imageWrapper: {
        flex: 1,
        alignSelf: 'flex-end',
        position: 'absolute',
    },
    image: {
        flex: 1,
    }
});