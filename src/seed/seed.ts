import { ConfigModel } from "../internal/internal.config.model";
import { ProblemModel } from "../modules/problem/problem.model";
import { TopicModel } from "../modules/topic/topic.model";
import { Arrays, Graphs, LinkedList, Queue, Stack, Strings, topics, Trees } from "./seedData";

export const seedDataInDb = async () => {
    try {
        let checkConfig = await ConfigModel.findOne({ configName: "default" });
        if (checkConfig && checkConfig.isSeedingDone) {
            return {
                success: false,
                message: "Seeding already done. To reseed, reset the seeding config."
            };
        }

        console.log("Seeding process initiated 🕑");


        if (!checkConfig) {
            checkConfig = await ConfigModel.create({ configName: "default", isSeedingDone: false });
        }

        if (topics.length === 0) {
            return {
                success: false,
                message: "No Topics to seed."
            };
        }

        const seedData: any = {
            Arrays: Arrays,
            Strings: Strings,
            "Linked List": LinkedList,
            Stack: Stack,
            Queue: Queue,
            Trees: Trees,
            Graphs : Graphs
        }

        await TopicModel.deleteMany({});
        await ProblemModel.deleteMany({});
        const createTopics = await TopicModel.insertMany(topics);

        const problemsToInsert = createTopics.map((topic: any) => {
            const topicProblems = seedData[topic.title]
            if (!topicProblems) return null;

            return topicProblems.map((problem: any) => ({
                ...problem,
                topicId: topic._id
            }));
        })

        const flattenedProblems = problemsToInsert.flat().filter((p: any) => p !== null);
        await ProblemModel.insertMany(flattenedProblems);

        await ConfigModel.findByIdAndUpdate(
            { _id: checkConfig?._id },
            { isSeedingDone: true },
            { new: true }
        );

        return {
            success: true,
            message: "Data seeded successfully"
        };
    } catch (error: any) {
        console.log("Error seeding data:", error);
        return {
            success: false,
            message: "Failed to seed data",
            error: error.message
        };
    }
}