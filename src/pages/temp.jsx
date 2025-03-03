{/* Render uploaded files with page range inputs */}
<div className="mt-2">
          <h2 className="text-lg font-semibold">Uploaded Files:</h2>
          <ul>
            {order.files.map((file, index) => (
              <li key={index}>
                <div>
                  <strong>{file.name}</strong>
                </div>

                {/* Page range inputs for each file */}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="startPage"
                    className="w-full input input-bordered h-10"
                    value={order.noOfPagesToPrint[file.name]?.startPage || ""}
                    onChange={(e) => handlePageRangeChange(e, file.name)}
                    placeholder="Start Page"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="endPage"
                    className="w-full input input-bordered h-10"
                    value={order.noOfPagesToPrint[file.name]?.endPage || ""}
                    onChange={(e) => handlePageRangeChange(e, file.name)}
                    placeholder="End Page"
                    min="0"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>