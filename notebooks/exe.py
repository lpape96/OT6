import sys
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta
import math 

##############################################
# Turbo variables                            #
##############################################
user_file_path = "/Users/clementguittat/Documents/INSA LYON/5A/Système reparti/OT6/notebooks/poi"
diameter = 500 ##Diameter of POI (in meter)
duration = 60*120 ##Duration spent in zone to be considered as POI (in second)
d2r = math.pi / 180
milli2minute = 1000 * 60


def main(user, commande):
    print("User : " + user)
    
    #On veut tout calculer sa mère et c'est chiant
    if commande == 0:
        create_poi_user_file(user)
        get_house_and_work_place(user)

    #On veut pas tout calculer sa mère et juste lire comme des tapettes
    if commande == 1:
        get_house_and_work_place(user)
    
    return 1

def create_poi_user_file(user):
    user_global_path = user_file_path + '/' + user
    dataset_user = pd.read_csv(user_global_path)
    POI_df = identifyPOI(dataset_user)
    poi_df_final = identifyPOItoCatch(POI_df)
    path_poi = user_file_path + '/poi_' + user
    poi_df_final.to_csv(path_poi)

def get_house_and_work_place(user):

    print('get_house_and_work_place')
    user_poi_path = user_file_path + '/poi_' + user
    poi_dataset_user = pd.read_csv(user_poi_path)
    poi_dataset_user['Center'] = poi_dataset_user.apply(change_to_pair, axis=1)

    poi_dataset_user['Entry_date']= pd.to_datetime(poi_dataset_user['Entry_date'])

    poi_dataset_user["Week_day"]=""

    for index, day in poi_dataset_user['Entry_date'].iteritems():
        poi_dataset_user["Week_day"][index]=day.weekday()
        
    poi_dataset_user["Week_day"]
    poi_dataset_user.drop("Unnamed: 0",axis=1,inplace=True)
    work_home_df = findPlace(poi_dataset_user)
    final_result_path = user_file_path + '/res_' + user
    work_home_df.to_csv(final_result_path)


def change_to_pair(row):
    string = row['Center']
    ret = string[1:-1].replace(" ", "").split(',')
    ret[0] = float(ret[0])
    ret[1] = float(ret[1])
    return ret

def distance(lat1,long1,lat2,long2):
    earthRadius = 6371000.0
    
    dLat = math.radians(lat2-lat1)
    dLong = math.radians(long2-long1)
    
    a = math.sin(dLat/2)*math.sin(dLat/2) + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLong/2) * math.sin(dLong/2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    dist = earthRadius * c
    
    return dist

def getCenter(latArray, longArray):
    averageLat = 0.0
    averageLong = 0.0
    
    for d in latArray:
        averageLat += d
    for d in longArray:
        averageLong += d
        
    averageLat /= len(latArray)
    averageLong /= len(longArray)
    
    return averageLat, averageLong

def normalize_POI(poi_dataframe):
    posArray = poi_dataframe['Center']
    temp_general_array = []
    for i in range(0, len(posArray)):
        
        
        temp_index_array = []
        temp_lat_array = []
        temp_lng_array = []
        
        if i not in temp_general_array:
            temp_lat_array.append(poi_dataframe.iloc[i]['Center'][0])
            temp_lng_array.append(poi_dataframe.iloc[i]['Center'][1])
            temp_index_array.append(i)
            temp_general_array.append(i)

            for j in range(0,len(posArray)):
                if (distance(posArray[i][0],posArray[i][1],posArray[j][0],posArray[j][1]) < diameter):

                    if i!=j:
                        if j not in temp_general_array:
                            temp_index_array.append(j)
                            temp_lat_array.append(poi_dataframe.iloc[j]['Center'][0])
                            temp_lng_array.append(poi_dataframe.iloc[j]['Center'][1])
                            temp_general_array.append(j)
                
            center = getCenter(temp_lat_array,temp_lng_array)

            for index in temp_index_array:
                poi_dataframe.iloc[index]['Center'][0] = center[0]
                poi_dataframe.iloc[index]['Center'][1] = center[1]
                
    return poi_dataframe

                


def identifyPOItoCatch(df):
    timeArray = df['Entry_date']
    posArray = df['Center']
    deltaTArray = df['DeltaT']
    for i in range(0, len(posArray)):
        for j in range(0,len(posArray)):
            if (distance(posArray[i][0],posArray[i][1],posArray[j][0],posArray[j][1]) < diameter):
                posArray.drop(labels=[j],inplace=True)
                timeArray.drop(labels=[j],inplace=True)
                deltaTArray.drop(labels=[j],inplace=True)
        posArray.reset_index(drop=True)
        timeArray.reset_index(drop=True)
        deltaTArray.reset_index(drop=True)
        
    return pd.DataFrame({'Center':posArray,'Entry':timeArray,'deltaT':deltaTArray})

def findPlace(df):
    #parsing columns
    dfCopy = df.copy()
    dfCopy["Entry_date"] = pd.to_datetime(dfCopy["Entry_date"])
    dfCopy["day"] = dfCopy["Entry_date"].dt.dayofweek
   
    #groupby center to get the sum of size and deltaT
    tmp = df.groupby(dfCopy['Center'].map(tuple)).sum()
    tmp = tmp.rename(columns={"DeltaT": "TotalDeltaT", "Size": "TotalSize"})

    #parsing before merge
    dfCopy['Center'] = dfCopy['Center'].map(tuple)

    #merge the two dataframe to get all informations in one df
    res = pd.merge(dfCopy, tmp, on="Center")
    
    #get work place
    workTimeMask = (res["Entry_date"].dt.hour > 9) & (res["Entry_date"].dt.hour < 12)
    workDays = res.loc[res["day"] < 5].loc[workTimeMask]
    workPlaceRow = workDays.loc[workDays["TotalDeltaT"].idxmax()]

    #get living place
    houseTimeMask = res["Entry_date"].dt.hour > 18
    houseDays = res.loc[res["day"] < 5].loc[houseTimeMask]
    houseRow = houseDays.loc[houseDays["TotalDeltaT"].idxmax()]
    # houseRow.drop(['Unnamed: 0_x'],inplace=True)
    # houseRow.drop(['Unnamed: 0_y'],inplace=True)
    # workPlaceRow.drop(['Unnamed: 0_x'],inplace=True)
    # workPlaceRow.drop(['Unnamed: 0_y'],inplace=True)
    
    #print(type(workPlaceRow))
    df_interesting_places=pd.DataFrame(columns=houseRow.index)
    df_interesting_places = df_interesting_places.append(workPlaceRow,ignore_index=True)
    df_interesting_places = df_interesting_places.append(houseRow,ignore_index=True)
    
    labels=['Workplace','Living Place']
    df_interesting_places['Place Category']=labels
    
    
    return df_interesting_places 
        

##############################################
# C'est ici qu'on envoie du gros main sa mère#
##############################################

user = sys.argv[1]
commande = int(sys.argv[2])
print(main(user,commande))