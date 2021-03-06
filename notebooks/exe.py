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
user_file_path = "/Users/clementguittat/Documents/INSA LYON/5A/Système reparti/OT6/notebookspoi"
diameter = 500 ##Diameter of POI (in meter)
duration = 60*120 ##Duration spent in zone to be considered as POI (in second)
d2r = math.pi / 180
milli2minute = 1000 * 60


def main(user, commande):
    
    #On veut tout calculer sa mère et c'est chiant
    if commande == 0:
        create_poi_user_file(user)
        get_house_and_work_place(user)

    #On veut pas tout calculer sa mère et juste lire comme des tapettes
    if commande == 1:
        get_house_and_work_place(user)

    if commande == 2:
        get_house_and_work_place(user)
        find_path_to_work(user)

    if commande == 3:
        covoit_perfectly_process_with_honnor()
    
    if commande == 5:
        normalize_poi_file(user)
    
    return 1

def normalize_poi_file(user):
    user_poi_path = user_file_path + '/poi_' + user
    poi_dataset_user = pd.read_csv(user_poi_path)
    poi_dataset_user.drop("Unnamed: 0",axis=1,inplace=True)
    poi_dataset_user['Center'] = poi_dataset_user.apply(change_to_pair, axis=1)
    poi_dataset_user = normalize_POI(poi_dataset_user)
    poi_dataset_user = poi_dataset_user.groupby(poi_dataset_user['Center'].map(tuple)).sum()
    normalized_path = user_file_path + '/normalized_poi' + user
    poi_dataset_user.to_csv(normalized_path)

def covoit_perfectly_process_with_honnor():
    datas = getData()
    covoit = checkCovoit(datas,27)
    can_covoit_path = user_file_path + '/can_covoit.csv'
    covoit.to_csv(can_covoit_path)

def create_poi_user_file(user):
    user_global_path = user_file_path + '/' + user
    dataset_user = pd.read_csv(user_global_path)
    POI_df = identifyPOI(dataset_user)
    path_poi = user_file_path + '/poi_' + user
    POI_df.to_csv(path_poi)

def get_house_and_work_place(user):

    user_poi_path = user_file_path + '/poi_' + user
    poi_dataset_user = pd.read_csv(user_poi_path)
    poi_dataset_user['Center'] = poi_dataset_user.apply(change_to_pair, axis=1)

    poi_dataset_user['Entry_date']= pd.to_datetime(poi_dataset_user['Entry_date'])

    poi_dataset_user["Week_day"]=""

    for index, day in poi_dataset_user['Entry_date'].iteritems():
        poi_dataset_user["Week_day"][index]=day.weekday()
        
    poi_dataset_user["Week_day"]
    poi_dataset_user.drop("Unnamed: 0",axis=1,inplace=True)
    poi_dataset_user = normalize_POI(poi_dataset_user)
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

def identifyPOI(df):
    POI_df = pd.DataFrame(columns=['Entry_date','DeltaT','Center','Size'])
    isEmpty = True
    latArray = []
    longArray = []
    timeArray = []
    for index, row in df.iterrows():
        date = datetime.strptime(row.Date.split('.')[0], '%Y-%m-%d %H:%M:%S')
        lat = row.Lat
        long = row.Long
        
        ##First entry
        if len(latArray) == 0 :
            latArray.append(lat)
            longArray.append(long)
            timeArray.append(date)
            isEmpty = False
            continue
        
        ##If still in the same POI
        if(distance(latArray[0], longArray[0], lat, long) < diameter):
            latArray.append(lat)
            longArray.append(long)
            timeArray.append(date)
        ##If new entry outside of actual POI
        else:
            dTime = timeArray[-1] - timeArray[0]
            if (dTime.total_seconds() < duration):
                
                ##Check if new instance is ok
                while (distance(latArray[0],longArray[0],lat,long) >= diameter):
                    latArray.pop(0)
                    longArray.pop(0)
                    timeArray.pop(0)
                    
                    if(len(latArray) == 0):
                        isEmpty = True
                        break
            ##Else valid POI
            else :
                center = getCenter(latArray,longArray)
                deltaT = timeArray[-1] - timeArray[0]
                deltaT = deltaT.total_seconds()
                POI_df = POI_df.append({'Entry_date':timeArray[0],'DeltaT':deltaT,'Center':center,'Size':len(latArray)},ignore_index=True)
    
                
                latArray.clear()
                longArray.clear()
                timeArray.clear()
                
            latArray.append(lat)
            longArray.append(long)
            timeArray.append(date)
    
    if isEmpty == False :
        center = getCenter(latArray,longArray)
        deltaT = timeArray[-1] - timeArray[0]
        deltaT = deltaT.total_seconds()
        POI_df = POI_df.append({'Entry_date':timeArray[0],'DeltaT':deltaT,'Center':center,'Size':len(latArray)},ignore_index=True)
    
    return POI_df


#J'la laisse au cas où, mais elle sert à rien.
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
    
    #get living place
    houseTimeMask = res["Entry_date"].dt.hour > 18
    houseDays = res.loc[res["day"] < 5].loc[houseTimeMask]
    houseRow = houseDays.loc[houseDays["TotalDeltaT"].idxmax()]
    
    houseRowCenter = houseRow['Center']
    print(res.shape)
    res.drop(res[res['Center'] == houseRowCenter].index, inplace=True)
    print(res.shape)

    
    #get work place
    workTimeMask = (res["Entry_date"].dt.hour > 9) & (res["Entry_date"].dt.hour < 12)
    workDays = res.loc[res["day"] < 5].loc[workTimeMask]
    print("work days infos :   ", workDays.head())
    workPlaceRow = workDays.loc[workDays["TotalDeltaT"].idxmax()]
    
    print("Work place coord : ", workPlaceRow["Center"])
    print("Living place coord : ", houseRow["Center"])
    
    #print(type(workPlaceRow))
    df_interesting_places=pd.DataFrame(columns=houseRow.index)
    df_interesting_places = df_interesting_places.append(workPlaceRow,ignore_index=True)
    df_interesting_places = df_interesting_places.append(houseRow,ignore_index=True)
    
    labels=['Workplace','Living Place']
    df_interesting_places['Place Category']=labels
    
    
    return df_interesting_places


def get_second_day(df):

    df.drop(df[df['day'] == df.iloc[0]['day']], inplace=True)



def find_path_to_work(user):
    user_trace_path = user_file_path + '/' + user + '.csv'
    user_trace_df = pd.read_csv(user_trace_path)

    user_trace_df["Date"] = pd.to_datetime(user_trace_df["Date"])
    user_trace_df["weekday"] = user_trace_df["Date"].dt.dayofweek
    user_trace_df["day"] = user_trace_df["Date"].dt.date

    #Delete first day
    user_trace_df = user_trace_df[user_trace_df['day'] != user_trace_df.iloc[0]['day']]

    final_result_path = user_file_path + '/res_' + user + '.csv'
    user_result_df = pd.read_csv(final_result_path)

    user_result_df['Center'] = user_result_df.apply(change_to_pair, axis=1)

    workLat = user_result_df['Center'].iloc(0)[0][0] 
    workLong = user_result_df['Center'].iloc(0)[0][1]
    houseLat = user_result_df['Center'].iloc(0)[1][0] 
    houseLong = user_result_df['Center'].iloc(0)[1][1]
    
    print("House lat :",houseLat)
    print("House lng :", houseLong)
    print("workLat :",workLat)
    print("workLong :",workLong)
    hourFilter = (user_trace_df["Date"].dt.hour >= 5 ) & (user_trace_df["Date"].dt.hour < 8)

    morningDf = user_trace_df.loc[user_trace_df["weekday"] == 1].loc[hourFilter]
    #morningDayDf = user_trace_df.loc[user_trace_df["weekday"] == 1].loc[hourFilter]
    #morningDf = user_trace_df.loc[user_trace_df["weekday"] == 1]

    print('Morning DF')
    print(morningDf)
    #print(user_trace_df[user_trace_df["Date"].dt.hour > 7])

    firstDate = morningDf.iloc[0]["day"]

    morningDayDf = morningDf.loc[morningDf["day"] != firstDate]

   # houseRow=pd.DataFrame(data=None, columns=morningDayDf.columns, index=morningDayDf.index)
    for index, row in morningDayDf.iterrows():
        dist = distance(houseLat, houseLong, row['Lat'], row['Long'])
        #print(dist)
        if dist <30:
            #print("Je passe")
            houseRow = row

    res = pd.DataFrame(columns=['Id','Date','Long','Lat','weekday','day'])
        
    for index, row in morningDayDf[morningDayDf['day'] >= houseRow['day']].iterrows():
        dist = distance(workLat, workLong, row['Lat'], row['Long'])
        if dist > 10:
            res = res.append(row, ignore_index=True)
        else:
            break
            
    Q1Long = np.percentile(res['Long'],10)
    Q3Long = np.percentile(res['Long'],85)

    Q1Lat = np.percentile(res['Lat'],10)
    Q3Lat = np.percentile(res['Lat'],85)

    filterLong = (res['Long'] > Q1Long) & (res['Long'] < Q3Long)
    filterLat = (res['Lat'] > Q1Lat) & (res['Lat'] < Q3Lat)


    res = res[filterLong]
    print(res.shape)
    res = res[filterLat]
    print(res.shape)

    path_trace = user_file_path + '/trace_' + user + '.csv'
    res[['Long','Lat']].to_csv(path_trace)

def areColleagues (lat1,lng1,lat2,lng2):

    max_dist=500 #distance maximale entre 2 coordonnees de travail pour dire si 2 personnes travaillent au meme endroit
    if(distance(float(lat1),float(lng1),float(lat2),float(lng2)) < max_dist):
        return True
    else:
        return False

def areLivingTogether (lat1,lng1,lat2,lng2):
    level_of_closseness=0 #0 not living close #1 Neighbor #2 living together
    max_dist=500
    if(distance(lat1,lng1,lat2,lng2) < max_dist):
        max_dist=100
        level_of_closseness=1
        if(distance(lat1,lng1,lat2,lng2) < max_dist):
            level_of_closseness=2 

    return level_of_closseness

def covoit(places_user1,places_user2):
    work_user1 = places_user1.Center.loc[places_user1['Place Category'] == 'Workplace']
    house_user1 = places_user1.Center.loc[places_user1['Place Category'] == 'Living Place']
    
    work_user2 = places_user2.Center.loc[places_user2['Place Category'] == 'Workplace']
    house_user2 = places_user2.Center.loc[places_user2['Place Category'] == 'Living Place']
    
    print(work_user1.iloc[0][0],work_user1.iloc[0][1], work_user2.iloc[0][0],work_user2.iloc[0][1])
    
    collegues = areColleagues(work_user1.iloc[0][0],work_user1.iloc[0][1], work_user2.iloc[0][0],work_user2.iloc[0][1])
    neighbors = areLivingTogether(house_user1.iloc[0][0],house_user1.iloc[0][1], house_user2.iloc[0][0],house_user2.iloc[0][1])

    
    if(collegues == True and neighbors in (1,2)):
         covoit = 'Yes'
    else :  covoit = 'No'

    center = [house_user2.iloc[0][0],house_user2.iloc[0][1]]
    
    return [collegues,neighbors,covoit,center]

def getData():
    datas = pd.DataFrame(columns=['Entry_date','DeltaT','Center','Size','day','TotalDeltaT','TotalSize','Place Category','user_id'])

    places_user_27 = pd.read_csv('.\\poi\\res_user_27.csv')
    places_user_27['Center'] = places_user_27.apply(change_to_pair, axis=1)
    places_fictif_3 = pd.read_csv('.\\poi\\fictif_user3.csv')
    places_fictif_3['Center'] = places_fictif_3.apply(change_to_pair, axis=1)
    places_fictif_4 = pd.read_csv('.\\poi\\fictif_user4.csv')
    places_fictif_4['Center'] = places_fictif_4.apply(change_to_pair, axis=1)
    
    datas = datas.append(places_user_27, ignore_index=True)
    datas.iloc[-1,-1] = 27
    datas.iloc[-2,-1] = 27

    datas = datas.append(places_fictif_3, ignore_index=True)
    datas.iloc[-1,-1] = 3
    datas.iloc[-2,-1] = 3

    datas = datas.append(places_fictif_4, ignore_index=True)
    datas.iloc[-1,-1] = 4
    datas.iloc[-2,-1] = 4

    return datas

def checkCovoit(df,user):
    covoit_df = pd.DataFrame(columns={'user_id','Live near','Work near','Can covoit','Center'})
    places_user=df.loc[df['user_id']==user]
    for id_user in df['user_id'].unique():
        if (id_user == user) : continue
        places = df.loc[df['user_id']==id_user]
        [collegues, neighbors, covoiturage, center] = covoit(places_user,places)
        covoit_df = covoit_df.append({'user_id':id_user,'Live near':neighbors,'Work near':collegues,'Can covoit':covoiturage,'Center':center},ignore_index=True)
    return covoit_df



        

##############################################
# C'est ici qu'on envoie du gros main sa mère#
##############################################

user = sys.argv[1]
commande = int(sys.argv[2])
main(user,commande)