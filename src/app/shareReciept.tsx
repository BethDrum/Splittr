import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';

//local imports
import Button from '@/components/button';
import Modal from '@/components/modal';
import { useTheme } from '../themes/themeSwitcher';
import { themes } from '../themes/themes';

//setup objects
type People = {
  id: string;
  name: string;
}

interface Receipt {
  id: string;
  name: string;
  date: string;
  people: People[];
  modifiedItems: number[];
  totalItems: number[];
}

export default function shareReciept(){
    //setup relavent variables
    //for changable themes
    const { theme, themeName, toggleTheme } = useTheme();
    const styles = createStyles(theme);
    const icon = themeName === 'highContrast' ? require('../../assets/images/icons/darkToLight.png') : require('../../assets/images/icons/lightToDark.png');
    //recieve data from splitReciept.tsx
    const { mode, totals, receiptId } = useLocalSearchParams();
    //totalItems state for base item costs
    const [totalItems, setTotalItems] = useState<number[]>([]);
    //and  create modified ver for serive charge addition
    const [modifiedItems, setModifiedItems] = useState<number[]>([]);
    //keep track of if the data has been saved or not
    const [save, setSaved] = useState(false);
    //relevent data to display
    const [currentReceiptID, setCurrentReceiptId] = useState<string>('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [people, setPeople] = useState<People[]>([]);
    //for reading im saved data
    const [allReciepts, setAllReciepts] = useState<Receipt[]>([]);
    //for maths operations in service charge and discount
    const roundToTwo = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;
    const lengthOfTotal = Math.ceil((totalItems ||[]).length);
    //For service charge:
    const [serviceCharge, setServiceCharge] = useState(0);
    //calculate new ID
    const newId = Math.random().toString();


    //get data - if only the key is passed in (it is from a locally stored object, not currently created)
    const getItem = async (key: string) => {
        try {
            //get in all reciepts
            const tempAllReciepts = await SecureStore.getItemAsync('allReciepts');
            const receipts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //find specific reciept
            const specificReceipt = receipts.find((r: Receipt) => r.id === key);
            //error check for if reciept dosent exist
            if (!specificReceipt) {
                console.log('Receipt not found');
                return;
            }

            //set all relevent data
            setCurrentReceiptId(specificReceipt.id)
            setName(specificReceipt.name)
            setDate(specificReceipt.date)
            setPeople(specificReceipt.people)
            setModifiedItems(specificReceipt.modifiedItems)
            setTotalItems(specificReceipt.totalItems)
            setSaved(true)
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    };

    //to recieve name and date to display & (if selected) saved in the group - for if sent in from newly created receipt
    const getNameDatePeople = async () => {
        try{
        const storedName = await SecureStore.getItemAsync('name')
        const storedDate = await SecureStore.getItemAsync('date')
        const storedPeople = await SecureStore.getItemAsync('people')

        setName(storedName ? JSON.parse(storedName) : '');
        setDate(storedDate ? JSON.parse(storedDate) : '')
        setPeople(JSON.parse(storedPeople as string));
        
        console.log('Name: ',storedName, '\nDate: ',storedDate,'\n People: ',storedPeople)
        } catch (error) {
        console.error('Error when gathering information: ', error)
        }
    }

    //function to add the service charge
    const addService = () => {
        //haptic feedback
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
        if (serviceCharge === 0) return;

        const splitAmount = (roundToTwo(serviceCharge / lengthOfTotal));
        //update items to include service charge
        setModifiedItems(
            totalItems.map(item => item + splitAmount)
        );
    }

    //to share the data
    const onShare = async () => {
        //haptic feedback
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
        try {
            //message to send, includes all data for the receipt
            const result = await Share.share({
            message:
            `${name}\n${date}\n\n` +
            'The split receipt is as follows:\n\n' +
            modifiedItems.map((amount, index) =>
                `${people[index]?.name ?? 'Unknown'}: £${amount.toFixed(2)}`
            )
            .join('\n')
        });

        } catch (error: any) {
        Alert.alert(error.message);
        }
    };

    //save information to local storage device
    const saveData = async () => {
        //haptic feedback
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
        //initialise object to store all info in
        const allData = {
            id: newId,
            name,
            date, 
            people,
            modifiedItems,
            totalItems,
        }

        try{
            //get existing events from local storage and split into its seperate events
            const tempAllReciepts = await SecureStore.getItemAsync('allReciepts');
            const allReciepts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //push new data onto the reciepts
            allReciepts.push(allData)

            //store intire array into local storage
            await SecureStore.setItemAsync('allReciepts', JSON.stringify(allReciepts));
            //alert complete and set saved as true to no longer show save button
            alert('data saved')
            setSaved(true)
            setCurrentReceiptId(newId)
        }catch (error){
            console.error('Error saving data: ', error)
        }
    };

    //option to delete the saved data
    const deleteData = async () => {
        //haptic feedback
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
        )
        try{
            //get in all reciepts
            const tempAllReciepts = await SecureStore.getItemAsync('allReciepts');
            const allReciepts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //find specific reciept and remove it using id
            const updated = allReciepts.filter((r: {id: string}) => r.id !== currentReceiptID);
            
            await SecureStore.setItemAsync('allReciepts', JSON.stringify(updated))

            setSaved(false);
            alert('Delteted')
        }catch (error) {
            console.error('Error removing items:', error)
        }
    };

    //to add haptic to theme change
    const handleThemeToggle = () => {
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );

        toggleTheme();
    }

    const goToHome = () => {
        //haptic feedback
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
        router.push({pathname: '/'});
    }

    //set totals to total & modefied items whenever totals is modefied 
    useEffect(() => {
        if (totals) {
            const tempTotalItems: number[] = JSON.parse(totals as string);
            setTotalItems(tempTotalItems);
            setModifiedItems(tempTotalItems);
        }
    }, [totals]);

    //run add service when serviceCharge or totalItems is updated
    useEffect(() => {
        addService();
    }, [serviceCharge, totalItems]);

    //get information when the page has started (either from creation or, locally stored)
    useEffect(() => {
        if (mode === 'saved') {
            getItem(receiptId as string);
        }else{
            getNameDatePeople();
        }
    }, []);

    return(
        //display all persons data in the style of a reciept
        <View style={styles.main}>
            {/* alter theme switch */}
            <Pressable onPress={handleThemeToggle} style={styles.imageSec}>
                <Image style={styles.image} source={icon} />
                <Text style={styles.note}>   Change theme</Text>
            </Pressable> 

            <View style={{marginTop: '10%'}}></View>
            <View style={styles.reciept}>
                {/* title */}
                <Text style={styles.textPrimary}>{name}</Text>
                <Text style={styles.textPrimary}>{date}</Text>
                <View style={styles.dottedLine}>
                    {Array.from({ length: 40 }).map((_, i) => (
                        <View key={i} style={styles.singleDot}/>
                    ))}
                </View>
                <View style={styles.gap}></View>
                {/* for each person to see the total for, dynamically changes to number of totals recieved */}
                {people.map((items, index) => (
                    <View key={index} style={styles.textSection}>
                    <Text style={styles.textSecondary}>{people[index]?.name}</Text>
                    <View style={styles.dottedLine}>
                        {Array.from({ length: 30 }).map((_, i) => (
                            <View key={i} style={styles.singleDot}/>
                        ))}
                    </View>
                    <Text style={styles.textSecondary}>£{modifiedItems[index]}</Text>
                    </View>
                ))}
            </View>



            {/* end of reciept styling */}
            <View style={styles.rippedLine}>
                {Array.from({ length: 40 }).map((_, i) => (
                    <View key={i} style={styles.rip}/>
                ))}
            </View>
            
            <View style={styles.buttonSection}>
            {/* option to add service charge or a discount to all */}
            <Modal modalTheme='service' onSubmit={(value) => setServiceCharge(value)}/>
            {/* <Modal theme='discount' onSubmit={(value) => setDiscount(value)}/> */}
            
            {/* option to share */}
            <Button buttonTheme='share' label='SHARE' onPress={onShare} />
            
            {/* option to save OR delete */}
            <Button buttonTheme='save' label={save ? 'DELETE SAVE' : 'SAVE'} onPress={save ? deleteData : saveData} />
            

            <Button buttonTheme='back' label='RETURN TO HOME' onPress={goToHome} />
            </View>
        </View>
    );

}

const createStyles = (theme: typeof themes.default) => StyleSheet.create({
  main: {
    backgroundColor: theme.secondaryBackground,
    height: '100%',
  },
  reciept: {
    backgroundColor: theme.mainBackground,
    minHeight: "40%",
    width: "90%",
    alignSelf: 'center',
    borderRadius: 10,
    padding: '5%',
  },
  textPrimary: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
  },
  textSecondary: {
    color: theme.primaryTextColor,
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 25,
  },
  dottedLine: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: '5%',
    },
    singleDot:{
        width: 6,
        height: 2,
        backgroundColor: theme.primaryTextColor,
        borderRadius: 1,
    },
    textSection:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: theme.primaryTextColor,
        minHeight: '6%',
    },
    rippedLine: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: -10,
    },
    rip:{
        width: 20,
        height: 20,
        backgroundColor: theme.secondaryBackground,
        transform: [{
            rotate: '40deg'
        }]
    },
    gap: {
        height: '5%',
    },
    buttonSection: {
        maxHeight: '60%',
        minHeight: '32%',
    },
    imageSec: {
        position: 'absolute',
        left: 15,
        top: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        zIndex: 999,
    },
    note: {
        color: theme.primaryTextColor,
        fontFamily: 'lucida grande',
        fontWeight: 'bold',
        fontSize: 15,
    }
});