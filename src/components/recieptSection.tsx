import { StyleSheet, Text, View } from 'react-native';

//local imports
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';


interface iRecieptSection {
    food: string;
    cost: string;
}

export default function recieptSection({food, cost}: iRecieptSection) {
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);

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


const createStyles = (theme: typeof themes.default) => StyleSheet.create({
    mainCard: {
        flex: 1,
        backgroundColor: theme.mainBackground,
        margin: 5,
        borderRadius: 10,
        color: theme.primaryTextColor,
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
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 20,
        padding: '2%', 
        paddingLeft: '5%',
    },
    cost: {
        color: theme.primaryTextColor,
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
        backgroundColor: theme.primaryTextColor,
        borderRadius: 1,
    }
});