import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    onPress: () => void;   
    name: string;
    date: string; 
};

export default function ReceiptCard({ onPress, name, date }: Props) {
    return(
        <View style={styles.cardWrapper}>
            <View>
                <Pressable onPress={onPress}>
                    <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Image style={styles.icon} source={require('../../assets/images/icons/Star 3.png')} />
                    </View>
                    <View>
                        <Text style={styles.textPrimary}>{name}</Text>
                        <Text style={styles.textSecondary}>{date}</Text>
                    </View>
                    </View>
                </Pressable>
            </View>
        </View>
  );
}


const styles = StyleSheet.create({
    iconBox: {
        backgroundColor: '#D4E0F3',
        width: '20%',
        height: '100%',
        borderRadius: 15,
        marginRight: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardWrapper: {
        width: '100%',
        height: 120,
        backgroundColor: '#FFFDF2',
        borderRadius: 10,
        padding: '5%',
        marginBottom: '2%',
    },
    textPrimary: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 40,
    },
    textSecondary: {
        color: '#4F4F4F',
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 30,
    },
    row: {
        flexDirection: 'row',
    },
    icon: {
        height: '70%',
        width: '60%',
    }
});