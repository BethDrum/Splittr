import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/button';
import Modal from '@/components/modal';

type People = {
  id: string;
  name: string;
}

interface Item {
  id: string;
  food: string;
  cost: string;
}

interface Receipt {
  id: string;
  name: string;
  date: string;
  people: People[];
  modifiedItems: Item[];
}

export default function shareReciept(){
    //SET VARIABLES
    //recieve data from splitReciept.tsx
    const { mode, totals, recieptId } = useLocalSearchParams();
    
    //totalItems state for base item costs
    const [totalItems, setTotalItems] = useState<number[]>([]);
    //and  create modified ver for serive charge addition
    const [modifiedItems, setModifiedItems] = useState<number[]>([]);

    //keep track of if the data has been saved or not
    const [save, setSaved] = useState(false);

    //relevent data to display
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [people, setPeople] = useState<People[]>([]);

    //for reading im saved data
    const [allReciepts, setAllReciepts] = useState<Receipt[]>([]);

    //get data - if only the object is passed in (it is from a locally stored object, not currently created)
    const getItem = async (key: string) => {
        try {
            //get in all reciepts
            const tempAllReciepts = await AsyncStorage.getItem('allReciepts');
            const allReciepts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //find specific reciept
            const specificReceipt = allReciepts.find((r: Receipt) => r.id === key);

            //set all relevent data
            setName(specificReceipt.name)
            setDate(specificReceipt.date)
            setPeople(specificReceipt.people)
            setSaved(true)
            //return value != null ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    };

    //to recieve name and date to display & (if selected) saved in the group
    const getNameDatePeople = async () => {
        try{
        const storedName = await AsyncStorage.getItem('name')
        const storedDate = await AsyncStorage.getItem('date')
        const storedPeople = await AsyncStorage.getItem('people')

        setName(storedName ? JSON.parse(storedName) : '');
        setDate(storedDate ? JSON.parse(storedDate) : '')
        setPeople(JSON.parse(storedPeople as string));
        
        console.log('Name: ',storedName, '\nDate: ',storedDate,'\n People: ',storedPeople)
        } catch (error) {
        console.error('Error when gathering information: ', error)
        }
    }

    //for maths operations in service charge and discount
    const roundToTwo = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;
    const lengthOfTotal = Math.ceil(totalItems.length);

    //For service charge:
    const [serviceCharge, setServiceCharge] = useState(0);

    const addService = () => {
        console.log(serviceCharge);
        //check if 0
        if (serviceCharge === 0) return;

        const splitAmount = (roundToTwo(serviceCharge / lengthOfTotal));
        console.log(splitAmount);
        //update items to include service charge
        setModifiedItems(
            totalItems.map(item => item + splitAmount)
        );
    }

    //for discount
    // const [discount, setDiscount] = useState(0);

    // const addDiscount = () => {
    //     //data comes in like 50 for 50%

    //     //calculate what to * all by
    //     const discountAmount = discount / 100;
    //     //update all items to include the discount
    //     setModifiedItems(
    //         totalItems.map(item => item * discountAmount)
    //     );
    // }


    //to share the data
    const onShare = async () => {
        try {
        const result = await Share.share({
            message:
            'The split reciept is as follows: \n' +
            modifiedItems.map((amount, index) => `Name: £${amount}`).join('\n')
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            // shared with activity type of result.activityType
            } else {
            // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
        } catch (error: any) {
        Alert.alert(error.message);
        }
    };

    //set totals to total & modefied items
    useEffect(() => {
        if (totals) {
            const tempTotalItems: number[] = JSON.parse(totals as string);
            setTotalItems(tempTotalItems);
            setModifiedItems(tempTotalItems);
        }
    }, [totals]);

    //run add service when serviceCharge is updated
    useEffect(() => {
        addService();
    }, [serviceCharge, totalItems]);

    //get information when the page has started (either from creation or, locally stored)
    useEffect(() => {
        if (mode === 'saved') {
            getItem(recieptId as string);
        }else{
            getNameDatePeople();

            const tempTotal: number[] = JSON.parse(totals as string);
        }
    }, []);

    //save information to device
    const saveData = async () => {
        const allData = {
            id: Math.random().toString(),
            name,
            date, 
            people,
            modifiedItems,
        }
        console.log(JSON.stringify(allData, null, 2));
        try{
            //get existing events from local storage and split into its seperate events
            const tempAllReciepts = await AsyncStorage.getItem('allReciepts');
            const allReciepts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //push new data onto the reciepts
            allReciepts.push(allData)

            //store intire array into local storage
            await AsyncStorage.setItem('allReciepts', JSON.stringify(allReciepts));
            //alert complete and set saved as true to no longer show save button
            alert('data saved')
            setSaved(true)
            console.log('saved')
        }catch (error){
            console.error('Error saving data: ', error)
        }
    };

    //option to delete the saved data
    const deleteData = async () => {
        const key = "here";
        try{
             //get existing events from local storage and split into its seperate events
            const tempAllReciepts = await AsyncStorage.getItem('allData');
            const allReciepts = tempAllReciepts ? JSON.parse(tempAllReciepts) : [];

            //find id of current

            setSaved(false);
            alert('Delteted')
        }catch (error) {
            console.error('Error removing items:', error)
        }
    };

    const goToHome = () => {
        router.push({pathname: '/'});
    }

    return(
        //display all persons data in the style of a reciept
        <View style={styles.main}>
            <View style={{marginTop: '5%'}}></View>
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
                {totalItems.map((items, index) => (
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
            <Modal theme='service' onSubmit={(value) => setServiceCharge(value)}/>
            {/* <Modal theme='discount' onSubmit={(value) => setDiscount(value)}/> */}
            
            {/* option to share */}
            <Button theme='share' label='SHARE' onPress={onShare} />
            
            {/* option to save OR delete */}
            <Button theme='save' label={save ? 'DELETE SAVE' : 'SAVE'} onPress={save ? deleteData : saveData} />
            

            <Button theme='back' label='RETURN TO HOME' onPress={goToHome} />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#D4E0F3',
    height: '100%',
  },
  reciept: {
    backgroundColor: '#FFFDF2',
    minHeight: "40%",
    width: "90%",
    alignSelf: 'center',
    borderRadius: 10,
    padding: '5%',
  },
  textPrimary: {
    color: '#4F4F4F',
    fontFamily: 'lucida grande',
    fontWeight: 'bold',
    fontSize: 30,
  },
  textSecondary: {
    color: '#4F4F4F',
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
        backgroundColor: '#4F4F4F',
        borderRadius: 1,
    },
    textSection:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#4F4F4F',
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
        backgroundColor: '#D4E0F3',
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
    }
});