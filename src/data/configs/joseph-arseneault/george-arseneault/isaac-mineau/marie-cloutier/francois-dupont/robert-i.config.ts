import { adelaisOfToursConfig } from "./adelais-of-tours.config";
export const robertIConfig = {
	// Robert participated in the defence of Paris during the Viking siege of Paris. Robert defeated a large band of Vikings in the Loire Valley in 921, after which the defeated invaders converted to Christianity and settled near Nantes.
	// King of West Francia from 922 to 923. Before his election to the throne he was Count of Poitiers, Count of Paris and Marquis of Neustria and Orléans
	name: "Robert I of France",
	sex: "Male",
	birthPlace: "France",
	deathPlace: "UNKNOWN",
	birthDate: "866",
	deathDate: "15 June 923",
	imageUrl: "./images/robert-i-of-france.jpg",
	parents: [
		adelaisOfToursConfig,
		{
			// Battle of Brissarthe. On 2 July 866, Robert was killed at the Battle of Brissarthe while defending Francia against a joint Breton-Viking raiding party led by Salomon, King of Brittany and the Viking chieftain Hastein
			// Margrave in Neustria. Count in the march of Anjou Comte d'Auxerre and Comte de Nevers 865.
			name: "Robert the Strong of Anjou",
			sex: "Male",
			birthPlace: "France",
			deathPlace: "Brissarthe, France",
			birthDate: "~820",
			deathDate: "2 July 866",
			imageUrl: "./images/robert-the-strong.jpg",
			parents: []
		}
	]
}