package poi;



import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;

/**
 * 
 * Identify POI
 * 
 * @author aboutet
 *
 */

public class POIDetection2 {

	public static int diameter = 250;
	public static int duration = 30;
	public static double d2r = Math.PI / 180;
	public static int milli2minute = 1000*60;
	
	public static int NB = 0;
	
	public static SimpleDateFormat formatterWriteWithMinute = new SimpleDateFormat("yyyy-MM-dd-HH:mm:ss");
	
	public static  boolean isInt = true;
	public static HashSet<Integer> users = new HashSet<>();
	
	public static void main(String[] args) {

//		if(args.length<3) {
//			System.out.println("Usage: data (sorted by time) diameter duration ");
//			System.exit(0);
//		}
//		diameter = Integer.parseInt(args[1]);
//		duration = Integer.parseInt(args[2]);	
//		String filename = args[0];
						
		String filename = "/home/aboutet//Documents/research/citi/insa/cours/5IFSVP/data/google/Takeout/history/dataGoogle-sorted";
		
		identifyPOI(filename, filename.replaceAll(".csv", "")+"."+duration + "." + diameter+".poi.csv");
		
		identifyPOI2Catch(filename.replaceAll(".csv", "")+"."+duration + "." + diameter+".poi.csv", 
				filename.replaceAll(".csv", "")+"."+duration + "." + diameter+".poi.tocollect.csv");
		
	}

	
	private static void identifyPOI2Catch(String filename, String output) {
		
		ArrayList<Double> llat = new ArrayList<>();
		ArrayList<Double> llng = new ArrayList<>();
		ArrayList<String> lt = new ArrayList<>();
		
		try {
			BufferedReader br = new BufferedReader(new FileReader(filename));
			
			String line;
			while ((line = br.readLine()) != null) {

				String t = line.substring(0, line.indexOf(","));
				
				lt.add(t);

				//pass timestamp
				line = line.substring(line.indexOf(",")+1);
				
				//pass date
				line = line.substring(line.indexOf(",")+1);
				
				Double lat = Double.parseDouble(line.substring(0, line.indexOf(",")));
				
				llat.add(lat);

				//pass lat
				line = line.substring(line.indexOf(",")+1);
				
				Double lng = Double.parseDouble(line.substring(0, line.indexOf(",")));
				
				llng.add(lng);
				
			}
			br.close();
			
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		for(int i=0; i<llat.size(); i++) {
			
			for(int j=0; j<llat.size(); j++) {
			
				if(distance(llat.get(i), llng.get(i), llat.get(j), llng.get(j))<diameter) {
					llat.remove(j);
					llng.remove(j);
					lt.remove(j);
				}
				
			}			
		}
		
		try {
			
			FileWriter fstream = new FileWriter(output);
			BufferedWriter out = new BufferedWriter(fstream);
			
			for(int i=0; i<llat.size(); i++) {						
				out.write(i + ","+llat.get(i)+","+llng.get(i) + ","+ lt.get(i) + "\n");				
			}
			
			out.close();
			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}


	private static void identifyPOI(String filename, String logFile) {

		ArrayList<Double> x = new ArrayList<Double>();
		ArrayList<Double> y = new ArrayList<Double>();
		ArrayList<Long> time = new ArrayList<Long>();
		ArrayList<String> initialLine = new ArrayList<String>();
		
		try {
			BufferedReader br = new BufferedReader(new FileReader(filename));
			
			String line;
			while ((line = br.readLine()) != null) {
				
				String l = line.substring(line.indexOf(",")+1);
				
				// skip counter				
				line = line.substring(line.indexOf(",")+1);
												
				// date format
				Long t = 1000 * Long.parseLong(line.substring(0, line.indexOf(",")));
				
				//pass timestamp
				line = line.substring(line.indexOf(",")+1);
				
				Double cood_x = Double.parseDouble(line.substring(0, line.indexOf(",")));

				//pass cood_x
				line = line.substring(line.indexOf(",")+1);
				
				Double cood_y = Double.parseDouble(line);
				
				
				// first entry
				if(x.size()==0) {
					x.add(cood_x);
					y.add(cood_y);
					time.add(t);
					initialLine.add(l);
					continue;
				}
				
				
				// if still in the same POI
				if(distance(x.get(0), y.get(0), cood_x, cood_y) < diameter) {
					x.add(cood_x);
					y.add(cood_y);
					time.add(t);
					initialLine.add(l);					
				}
				// the new entry is outside the current POI
				else {
					
					// if the duration at the same location is too short
					if(((time.get(time.size()-1) - time.get(0))/milli2minute) < duration) {
						
						
						// check if new distance if ok
						while(distance(x.get(0), y.get(0), cood_x, cood_y) >= diameter) {
														
//							log(logFile,initialLine.get(0));
							
							x.remove(0);
							y.remove(0);
							time.remove(0);
							initialLine.remove(0);
							
							if(x.size()==0) {
								break;
							}
						}
						
					}
					// else valid POI
					else {
						
						String center = getCenter(x,y);
						long deltaT = time.get(time.size()-1) - time.get(0);
						log(logFile,center, time.get(0), deltaT, x.size());
						
						x.clear();
						y.clear();
						time.clear();
						initialLine.clear();
						
					}
					
					x.add(cood_x);
					y.add(cood_y);
					time.add(t);
					initialLine.add(l);
				}
				
//				System.out.println(uid + " " + t + " " + cood_x + " " + cood_y);
			}
			br.close();
			
			
			if(initialLine.size()>1) {
				String center = getCenter(x,y);
				long deltaT = time.get(time.size()-1) - time.get(0);
				log(logFile,center, time.get(0), deltaT, x.size());
			}
			else {
//				log(logFile,initialLine.get(0));
			}
			
			

			
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	
	private static void log(String filename, String center, long t0, long deltaT, int size) {

		try {
			
			FileWriter fstream = new FileWriter(filename, true);
			BufferedWriter out = new BufferedWriter(fstream);
			
//			out.write(center + " " + t0 + " " + formatterWriteWithMinute.format(new Date(t0)) + " " + deltaT + " " + (deltaT/milli2minute) + " " + size + "\n");		
			out.write((t0/1000) + "," + formatterWriteWithMinute.format(new Date(t0)) + "," + center + ",poi," + (deltaT/milli2minute) + "," + size + "\n");
			out.close();
		
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static void log(String filename, String line) {

		try {
			
			FileWriter fstream = new FileWriter(filename, true);
			BufferedWriter out = new BufferedWriter(fstream);
					
			out.write(line + "\n");
			out.close();
		
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	private static String getCenter(ArrayList<Double> x, ArrayList<Double> y) {
		
		Double averageX = 0.0;
		Double averageY = 0.0;		
		
		for(Double d : x) {
			averageX += d;
		}
		
		for(Double d : y) {
			averageY += d;
		}
		
		averageX /= x.size();
		averageY /= y.size();
		
		return (averageX + "," + averageY);
	}

	
	public static float distance(Double lat1, Double lng1, Double lat2, Double lng2) {
	    double earthRadius = 6371000; //meters
	    double dLat = Math.toRadians(lat2-lat1);
	    double dLng = Math.toRadians(lng2-lng1);
	    double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	               Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
	               Math.sin(dLng/2) * Math.sin(dLng/2);
	    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	    float dist = (float) (earthRadius * c);

//	    System.out.print(dist + " meters ");
	    return dist;
	    }

}


