import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    onPress: () => void;
    theme?: 'title';
};

export default function Card({ onPress }: Props) {
    return(
        <View style={styles.cardWrapper}>
        <View style = {styles.mainCard}>
            <Pressable onPress={onPress}>
                <Text style={styles.text}>New Reciept</Text>
            </Pressable>
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
    },
    cardWrapper: {
        flex: 1,
        width: '100%',
    },
    text: {
        color: '#FFFDF2',
    }
});