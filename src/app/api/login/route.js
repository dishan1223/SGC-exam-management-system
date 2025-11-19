export async function POST(req){
	const data = await req.json();
	console.log(data);


	if(data.username===process.env.COLLEGE_USER_NAME && data.password===process.env.COLLEGE_PASSWORD){
		return Response.json({message:"OK"})
	}
	return Response.json({message:"False"})
}2